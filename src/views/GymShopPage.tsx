'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { SHOP_ITEMS, type ShopItem, type ShopItemCategory } from '@/data/shopItems';
import { getRankForXP, RANK_TIERS } from '@/utils/fighterProfile';
import './GymShopPage.css';

export default function GymShopPage() {
  const { profile, rank, spendCoins } = useFighterProfile();
  const { customization, update, purchaseItem, equipItem, unequipSlot } = useFighterCustomization();

  const [activeTab, setActiveTab] = useState<ShopItemCategory | 'all'>('all');
  const [purchaseConfirmItem, setPurchaseConfirmItem] = useState<ShopItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const coins = profile.fightCoins || 0;
  const unlockedIds = customization?.unlockedGear || [];
  const equipped = customization?.equippedGear || {};

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter(item => item.category === activeTab);
  }, [activeTab]);

  // Check if a rank requirement is met
  const isRankMet = (requiredRank?: string) => {
    if (!requiredRank) return true;
    const currentRankIdx = RANK_TIERS.findIndex(t => t.name === rank.name);
    const requiredRankIdx = RANK_TIERS.findIndex(t => t.name === requiredRank);
    return currentRankIdx >= requiredRankIdx;
  };

  const handlePurchase = (item: ShopItem) => {
    if (coins < item.price) {
      setErrorMsg(`You need ${item.price - coins} more Seed Coins 🌱 to buy this item.`);
      return;
    }
    setPurchaseConfirmItem(item);
  };

  const confirmPurchase = () => {
    if (!purchaseConfirmItem) return;
    const item = purchaseConfirmItem;
    setPurchaseConfirmItem(null);

    const success = purchaseItem(item);
    if (success) {
      setSuccessMsg(`Successfully purchased ${item.name}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(`Failed to purchase ${item.name}. Verify your rank and coin balance.`);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleEquipToggle = (item: ShopItem) => {
    if (item.category === 'style') {
      const isEquipped = equipped.style === item.styleStageId;
      if (isEquipped) {
        unequipSlot('style');
      } else if (item.styleStageId) {
        equipItem('style', item.styleStageId);
      }
    } else if (item.category === 'swatch' && item.swatchSlot && item.swatchIndex !== undefined) {
      const defaults = { gloveColor: 0, hairColor: 1, shoeColor: 0, topColor: 0 };
      const isEquipped = customization?.[item.swatchSlot] === item.swatchIndex;
      if (isEquipped) {
        update({ [item.swatchSlot]: defaults[item.swatchSlot] });
      } else {
        update({ [item.swatchSlot]: item.swatchIndex });
      }
    }
  };

  const getEquipState = (item: ShopItem): 'equipped' | 'unlocked' | 'locked' => {
    if (item.category === 'boost') return 'locked'; // Boosts aren't equipped, they are consumable

    if (item.category === 'style') {
      const isUnlocked = unlockedIds.includes(item.id);
      if (!isUnlocked) return 'locked';
      return equipped.style === item.styleStageId ? 'equipped' : 'unlocked';
    }

    if (item.category === 'swatch' && item.swatchSlot && item.swatchIndex !== undefined) {
      const isUnlocked = unlockedIds.includes(item.id);
      if (!isUnlocked) return 'locked';
      return customization?.[item.swatchSlot] === item.swatchIndex ? 'equipped' : 'unlocked';
    }

    return 'locked';
  };

  return (
    <div className="gym-shop-page">
      {/* Header Row */}
      <header className="shop-header glass-panel">
        <div className="shop-header__left">
          <Link href="/dashboard" className="shop-back-btn">
            <Icons.ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="shop-title">
            THE <span className="text-primary">KITCHEN SHOP</span>
          </h1>
          <p className="shop-subtitle">SPEND EARNED SEED COINS TO UNLOCK COSMETIC GEAR AND BOOSTS</p>
        </div>
        <div className="shop-header__balance">
          <div className="coin-pill">
            <span className="coin-pill__icon">🌱</span>
            <span className="coin-pill__amount">{coins.toLocaleString()}</span>
            <span className="coin-pill__label">SEED COINS</span>
          </div>
        </div>
      </header>

      {/* Message banners */}
      {successMsg && (
        <div className="shop-alert shop-alert--success glass-panel">
          <Icons.Check size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="shop-alert shop-alert--error glass-panel">
          <Icons.X size={18} /> {errorMsg}
          <button className="shop-alert__close" onClick={() => setErrorMsg(null)}>Close</button>
        </div>
      )}

      {/* Navigation tabs */}
      <nav className="shop-tabs">
        {(['all', 'style', 'swatch', 'boost'] as const).map(tab => {
          const tabLabels = {
            all: 'ALL ITEMS',
            style: 'TRANSMOG STYLES',
            swatch: 'PREMIUM COLORS',
            boost: 'BOOSTS & ITEMS',
          };
          return (
            <button
              key={tab}
              className={`shop-tab-btn ${activeTab === tab ? 'shop-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </nav>

      {/* Grid of Items */}
      <div className="shop-grid">
        {filteredItems.map(item => {
          const IconComponent = (Icons as any)[item.icon] || Icons.ShoppingBag;
          const rankMet = isRankMet(item.requiredRank);
          const equipState = getEquipState(item);
          const isUnlocked = unlockedIds.includes(item.id) || (item.category === 'boost' && item.id === 'streak-freeze');

          return (
            <div key={item.id} className={`shop-card shop-card--${item.rarity} glass-panel`}>
              <div className="shop-card__badge-row">
                <span className={`rarity-tag rarity-tag--${item.rarity}`}>{item.rarity.toUpperCase()}</span>
                {item.requiredRank && (
                  <span className={`rank-requirement-tag ${rankMet ? 'rank-requirement-tag--met' : ''}`}>
                    {rankMet ? '' : `🔒 ${item.requiredRank}`}
                  </span>
                )}
              </div>

              <div className="shop-card__visual">
                <div className="shop-visual-glow" />
                <IconComponent size={36} className="shop-card__icon" />
              </div>

              <div className="shop-card__info">
                <h3 className="shop-card__name">{item.name}</h3>
                <p className="shop-card__desc">{item.description}</p>
              </div>

              <div className="shop-card__footer">
                {/* Consumables (Boosts) */}
                {item.category === 'boost' && (
                  <div className="boost-purchase-row">
                    <span className="boost-owned-tag">Owned: {profile.streakFreezes || 0}</span>
                    <button
                      className="shop-buy-btn"
                      disabled={!rankMet || (profile.streakFreezes ?? 0) >= 3}
                      onClick={() => handlePurchase(item)}
                    >
                      {(profile.streakFreezes ?? 0) >= 3 ? 'MAXED' : `BUY (+1): ${item.price} 🌱`}
                    </button>
                  </div>
                )}

                {/* Cosmetic Equips (Styles/Swatches) */}
                {item.category !== 'boost' && (
                  <>
                    {!isUnlocked ? (
                      <button
                        className="shop-buy-btn"
                        disabled={!rankMet}
                        onClick={() => handlePurchase(item)}
                      >
                        {!rankMet ? 'LOCKED' : `${item.price} 🌱`}
                      </button>
                    ) : (
                      <button
                        className={`shop-equip-btn ${equipState === 'equipped' ? 'shop-equip-btn--active' : ''}`}
                        onClick={() => handleEquipToggle(item)}
                      >
                        {equipState === 'equipped' ? 'EQUIPPED' : 'EQUIP'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal overlay */}
      {purchaseConfirmItem && (
        <div className="shop-modal-overlay">
          <div className="shop-modal glass-panel">
            <h2 className="shop-modal__title">CONFIRM PURCHASE</h2>
            <p className="shop-modal__text">
              Are you sure you want to buy <strong>{purchaseConfirmItem.name}</strong> for{' '}
              <span className="text-primary">{purchaseConfirmItem.price} Seed Coins 🌱</span>?
            </p>
            <div className="shop-modal__actions">
              <button className="shop-modal-btn shop-modal-btn--cancel" onClick={() => setPurchaseConfirmItem(null)}>
                CANCEL
              </button>
              <button className="shop-modal-btn shop-modal-btn--confirm" onClick={confirmPurchase}>
                CONFIRM PURCHASE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
