import React, { useState, useEffect } from 'react';
import LocalsCard from './local-cards';
import LocalsMap from './local-map';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { TiStarFullOutline } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";

import { useUser } from '../contexts/user-context';
import './locals.css';

const Locals = () => {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [infoLocal, setInfoLocal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locals, setLocals] = useState([]);
  const [filteredByLove, setFilteredByLove] = useState(false);
  const { userDetails } = useUser();
  const [loveList, setLoveList] = useState([]);
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Locals'));
        const localsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocals(localsList);
      } catch (error) {
        console.error('Error fetching locals:', error);
      }
    };

    const fetchLoveList = async () => {
      if (userDetails?.uid) {
        const userRef = doc(db, 'Users', userDetails.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setLoveList(data.loveList || []);
        }
      }
    };

    fetchLocals();
    fetchLoveList();
  }, [userDetails]);

  useEffect(() => {
    const fetchLocalDetails = async () => {
      if (infoLocal?.id) {
        try {
          const docRef = doc(db, 'Locals', infoLocal.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setLocalData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching local details:', error);
        }
      }
    };

    fetchLocalDetails();
  }, [infoLocal]);

  const location = useLocation();

useEffect(() => {
  if (location.state?.localId && locals.length > 0) {
    const matched = locals.find((l) => l.id === location.state.localId);
    if (matched) {
      setInfoLocal(matched);
      setSelectedLocal(matched);
    }
  }
}, [location.state, locals]);


  const handleLoveToggle = async (localId) => {
    if (!userDetails?.uid) return;
    const userRef = doc(db, 'Users', userDetails.uid);
    const updatedLoveList = loveList.includes(localId)
      ? loveList.filter(id => id !== localId)
      : [...loveList, localId];

    await updateDoc(userRef, { loveList: updatedLoveList });
    setLoveList(updatedLoveList);
  };

  const filteredLocals = locals.filter((local) => {
    const matchesSearch = local.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filteredByLove) {
      return matchesSearch && loveList.includes(local.id);
    }
    return matchesSearch;
  });

  return (
    <div className="locals-page">
      <div className="locals-list">
        {!infoLocal ? (
          <>
            <div className="filter-buttons">
              <button
                className={filteredByLove === false ? 'active' : ''}
                onClick={() => setFilteredByLove(false)}
              >
                OUR LOCALS
              </button>
              <button
                className={filteredByLove === true ? 'active' : ''}                
                onClick={() => setFilteredByLove(true)}
              >
                MY FAVORITES
              </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search locals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredLocals.length === 0 ? (
              <div className="card-horizontal no-result-card">
                <div className="card-info">
                  <h3>No results found</h3>
                  <p className="description">Try searching for something else.</p>
                </div>
              </div>
            ) : (
              filteredLocals.map((local, index) => (
                <LocalsCard
                  key={index}
                  local={local}
                  onClick={() => setSelectedLocal(local)}
                  onInfoClick={() => {
                    setInfoLocal(local);
                    setLocalData(null);
                  }}
                  selected={selectedLocal?.name === local.name}
                  isLoved={loveList.includes(local.id)}
                  onLoveToggle={() => handleLoveToggle(local.id)}
                />
              ))
            )}
          </>
        ) : (
          localData ? (
            <div className="info-panel">
              <IoIosCloseCircle className="close-btn" onClick={() => setInfoLocal(null)} />

              <img src={localData.image} alt={localData.name} className="info-img" />

              <div className="info-description">
                <div className="info-header">
                  <h2>{localData.name}</h2>
                  <h2 className="rating"><TiStarFullOutline/> {localData.rating}</h2>
                </div>

                <hr />
                <div className="info-line">
                  <span><FaPhone/> <a href={`tel:${localData.tel}`}>{localData.tel}</a></span>
                </div>
                <div className="info-line">
                  <span><BsGlobe/> <a href={localData.website} target="_blank" rel="noopener noreferrer">{localData.name}</a></span> 
                </div>
                <div className="info-line">
                  <span><FaLocationDot/> <a href={localData.mapURL} target="_blank" rel="noopener noreferrer">{localData.address}</a></span>
                </div>
                <hr />

                <ul className="hours-list">
                  {Object.entries(localData.hours)
                    .sort(([dayA], [dayB]) => {
                      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                      return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
                    })
                    .map(([day, time]) => (
                      <li key={day}>
                        <strong>{day}</strong> {time}
                      </li>
                    ))}
                </ul>

              </div>
            </div>
          ) : <p>Loading details...</p>
        )}
      </div>

      <div className="locals-map-section">
        <LocalsMap
          locals={filteredLocals}
          selectedLocal={selectedLocal}
          setSelectedLocal={setSelectedLocal}
        />
      </div>
    </div>
  );
};

export default Locals;