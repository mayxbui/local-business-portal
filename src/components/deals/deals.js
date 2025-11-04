import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../contexts/user-context.js';
import { useLocation } from 'react-router-dom';
import DealsCard from './deal-cards.js';
import Barcode from 'react-barcode';
import { FaUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import mystery from '../../assets/mystery.png';
import present from '../../assets/present.png';
import { IoIosCloseCircle } from "react-icons/io";
import task from '../../assets/task.png';

import './Deals.css';

const Deals = () => {
  const { userDetails } = useUser();
  const location = useLocation();
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('hot');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [myDeals, setMyDeals] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Deals'));
        const dealsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeals(dealsList);
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    const fetchUserData = async () => {
      if (userDetails?.uid) {
        const userRef = doc(db, 'Users', userDetails.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserPoints(data.points || 0);
          setMyDeals(data.myDeals || []);
        }
      }
    };

    fetchDeals();
    fetchUserData();
  }, [userDetails]);

  useEffect(() => {
    if (location.state?.dealId && deals.length > 0) {
      const matchedDeal = deals.find((d) => d.id === location.state.dealId);
      if (matchedDeal) setSelectedDeal(matchedDeal);
    }
  }, [location.state, deals]);

  const handleRedeem = async () => {
    if (!userDetails || !selectedDeal) return;
    if (myDeals.includes(selectedDeal.id)) {
      toast.warning('You have already claimed this deal!');
      return;
    }
    if (userPoints < selectedDeal.points) {
      toast.error('Not enough points!');
      return;
    }
    const userRef = doc(db, 'Users', userDetails.uid);
    const updatedPoints = userPoints - selectedDeal.points;
    const updatedMyDeals = [...myDeals, selectedDeal.id];
    await updateDoc(userRef, {
      points: updatedPoints,
      myDeals: updatedMyDeals,
    });
    setUserPoints(updatedPoints);
    setMyDeals(updatedMyDeals);
    toast.success('Deal redeemed successfully!');
  };

  const filteredDeals = deals.filter(deal =>
    deal.locations.some(loc =>
      loc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const displayDeals = tab === 'hot'
    ? filteredDeals
    : deals.filter(deal => myDeals.includes(deal.id));

  const isMyDeal = selectedDeal && myDeals.includes(selectedDeal.id);

  return (
    <div className="deals-page">
      <div className="deals-list">
        {!selectedDeal ? (
          <>
            <div className="tab-buttons">
              <button className={tab === 'hot' ? 'active' : ''} onClick={() => setTab('hot')}>HOT DEALS</button>
              <button className={tab === 'my' ? 'active' : ''} onClick={() => setTab('my')}>MY DEALS</button>
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search by location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {displayDeals.length === 0 ? (
              <div className="card-horizontal no-result-card">
                <div className="card-info">
                  <h3>No deals found</h3>
                  <p className="description">Try searching for another location.</p>
                </div>
              </div>
            ) : (
              displayDeals.map((deal, index) => (
                <DealsCard key={index} deal={deal} onInfoClick={() => setSelectedDeal(deal)} tab={tab} />
              ))
            )}
          </>
        ) : (
          <div className="info-panel">
            <IoIosCloseCircle className="close-btn" onClick={() => setSelectedDeal(null)} />
            <img src={selectedDeal.image} alt={selectedDeal.title} className="info-img" />
            <div className="info-description">
              <div className="info-header">
                <h2>{selectedDeal.title}</h2>
                <h2 className="rating">{selectedDeal.points} pts </h2>
              </div>
              <hr />
              <div className="info-line"><p>{selectedDeal.tagline}</p></div>
              <div className="info-line"><p>{selectedDeal.description}</p></div>
              <hr />
              <div className="info-columns">
                <div className="info-line">
                  <h4>Discounts:</h4>
                  <ul>{selectedDeal.discounts.map((discount, idx) => <li key={idx}>{discount}</li>)}</ul>
                </div>
                <div className="info-line">
                  <h4>Locations:</h4>
                  <ul>{selectedDeal.locations.map((loc, idx) => <li key={idx}>{loc}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className="deal-action">
              {tab === 'my' && isMyDeal ? (
                <Barcode className="barcode" value={selectedDeal.id} height={60} displayValue={false} />
              ) : (
                <button onClick={handleRedeem} className="redeem-btn">
                  Redeem for {selectedDeal.points} pts
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rewards">
        <div className="points-progress-container">
          <div className="points-header">
            <span>YOUR POINTS: {userPoints}</span>
            <span>300</span>
          </div>
          <div className="points-bar">
            <div
              className="points-fill"
              style={{ width: `${Math.min((userPoints / 300) * 100, 100)}%` }}
            >
            </div>
          </div>
        </div>

        <div className='rewards-content'>
          <div className="rewards-list">
            <div className="mystery-box-card">
              <div className="box-left">
                <img src={mystery} alt="Mystery Box" className="mystery-img" />
              </div>
              <div className="box-right">
                <h3 className="box-title">Mystery Box</h3>
                <p className="box-desc">50 pts/each</p>
                <hr className="box-desc"/>
                <button className="buy-btn">OPEN</button>
              </div>
            </div>

            <div className="bonus-tasks">
              <div className="box-left">
                <h4 className="box-title">Weekly Challenges</h4>
                <p className="box-desc">Share a photo for 5 pts</p>
                <p className="box-desc">Leave a review for 10 pts</p>
                <button className="buy-btn">GO</button>
              </div>
              <div className="box-right">
                <img src={task} alt="Bonus Task" className="bonus-img" />
              </div>
            </div>

            <div className="referral-section">
              <h4 className="box-title">Referral Bonus</h4>
              <p className="box-desc">Invite your friends and earn 10 points</p>
              
              <div className="box-desc referral-box">
                <div className="referral-code">
                  <label>Your Code</label>
                  <div className="code">QUAN10</div>
                </div>
                <div className="referral-link">
                  <label>Share Link</label>
                  <input type="text" value="https://myapp.com/signup?ref=QUAN10" readOnly />
                </div>
              </div>
            </div>
          </div>

          <div className="monthly-board">
              <h3 className="box-title">April's Wrap</h3>
              <img src={present} alt="Rewards" className="rewards-img" />
              <p className="board-highlight">Look what your friends got!</p>

              <ol className="rank-list">
                <li>
                  <span className="rank-num">1</span>
                  < FaUserCircle className='avatar'/>
                  <span className="name">Quan Tran</span>
                </li>
                <li>
                  <span className="rank-num">2</span>
                  < FaUserCircle className='avatar'/>
                  <span className="name">Astra Vo</span>
                </li>
                <li>
                  <span className="rank-num">3</span>
                  < FaUserCircle className='avatar'/>
                  <span className="name">Emily Huynh</span>
                </li>
                <li>
                  <span className="rank-num">4</span>
                  < FaUserCircle className='avatar'/>
                  <span className="name">Phuong Tran</span>
                </li>
                <li>
                  <span className="rank-num">5</span>
                  < FaUserCircle className='avatar'/>
                  <span className="name">Anh Nguyen</span>
                </li>
              </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;