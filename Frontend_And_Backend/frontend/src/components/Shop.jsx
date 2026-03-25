import { useEffect, useState } from 'react'
import './Shop.css'
import { equipShopItem, getProfile, getShopInventory, getShopItems, purchaseShopItem, useShopItem } from '../services/api'

function Shop({ user }) {
  const defaultItems = [
    {
      id: 1,
      name: 'Đóng băng chuỗi',
      description: 'Giữ chuỗi học của bạn an toàn trong 1 ngày',
      icon: '❄️',
      price: 200,
      category: 'power-up'
    },
    {
      id: 2,
      name: 'Sửa lỗi',
      description: 'Sửa một câu trả lời sai',
      icon: '🔧',
      price: 100,
      category: 'power-up'
    },
    {
      id: 3,
      name: 'Đổi trang phục Duo',
      description: 'Trang phục mùa hè cho cú mèo Duo',
      icon: '👕',
      price: 500,
      category: 'cosmetic'
    },
    {
      id: 4,
      name: 'Gấp đôi hoặc mất hết',
      description: 'Đặt cược XP - thắng gấp đôi!',
      icon: '🎲',
      price: 50,
      category: 'power-up'
    },
    {
      id: 5,
      name: 'Bộ sticker tiếng Nhật',
      description: 'Bộ sticker dễ thương',
      icon: '🎨',
      price: 300,
      category: 'cosmetic'
    },
    {
      id: 6,
      name: 'Lượt kiểm tra vô hạn',
      description: 'Không giới hạn lần kiểm tra',
      icon: '♾️',
      price: 1000,
      category: 'power-up'
    }
  ]
  const [items, setItems] = useState(defaultItems)
  const [gems, setGems] = useState(0)
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const [isLoadingShop, setIsLoadingShop] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const isCosmeticCategory = (category) => {
    const normalized = (category || '').toLowerCase()
    return ['cosmetic', 'outfit', 'theme', 'avatar', 'decoration'].includes(normalized)
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const applyInventoryToItems = (shopItems, inventoryItems) => {
    const purchasedMap = new Map(
      (inventoryItems || []).map((item) => [item.id, item])
    )

    return shopItems.map((item) => {
      const purchasedItem = purchasedMap.get(item.id)
      return {
        ...item,
        isPurchased: !!purchasedItem,
        isEquipped: !!purchasedItem?.isEquipped,
        quantity: Number(purchasedItem?.quantity || 0)
      }
    })
  }

  const loadShopData = async () => {
    try {
      setIsLoadingShop(true)
      const data = await getShopItems()
      let normalizedItems = defaultItems

      if (Array.isArray(data) && data.length > 0) {
        normalizedItems = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          icon: defaultItems[index % defaultItems.length].icon,
          price: item.price,
          category: item.category || 'power-up',
          isPurchased: !!item.isPurchased,
          isEquipped: !!item.isEquipped,
          quantity: Number(item.quantity || 0)
        }))
      }

      if (!user) {
        setItems(normalizedItems)
        return
      }

      try {
        const [inventory, profileData] = await Promise.all([
          getShopInventory().catch(() => ({})),
          getProfile?.()?.catch(() => ({})) || Promise.resolve({})
        ])
        
        const purchasedItems = inventory?.purchasedItems || inventory?.PurchasedItems || []
        setItems(applyInventoryToItems(normalizedItems, purchasedItems))

        // Get gems from inventory or profile
        if (typeof inventory?.gems === 'number') {
          setGems(inventory.gems)
        } else if (typeof inventory?.Gems === 'number') {
          setGems(inventory.Gems)
        } else if (typeof profileData?.gems === 'number') {
          setGems(profileData.gems)
        } else if (typeof profileData?.Gems === 'number') {
          setGems(profileData.Gems)
        }
      } catch (inventoryError) {
        console.error('Không thể tải kho vật phẩm, chỉ dùng danh sách cửa hàng.', inventoryError)
        setItems(normalizedItems)
      }
    } catch (error) {
      console.error('Không thể tải vật phẩm cửa hàng, dùng dữ liệu dự phòng.', error)
      setItems(defaultItems)
    } finally {
      setIsLoadingShop(false)
    }
  }

  useEffect(() => {
    loadShopData()
  }, [user])

  const handlePurchase = async (item) => {
    if (!user) {
      alert('Bạn cần đăng nhập để mua vật phẩm.')
      return
    }

    try {
      setIsLoadingAction(true)
      const result = await purchaseShopItem(item.id)
      await loadShopData()
      showToast(result?.message || `✅ Đã mua: ${item.name}`)
    } catch (error) {
      showToast(`❌ ${error?.message || 'Không thể mua vật phẩm. Vui lòng thử lại.'}`)
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleEquip = async (item) => {
    if (!user) {
      showToast('❌ Bạn cần đăng nhập để trang bị vật phẩm.')
      return
    }

    try {
      setIsLoadingAction(true)
      const result = await equipShopItem(item.id)
      await loadShopData()
      showToast(result?.message || '✅ Cập nhật trang bị thành công')
    } catch (error) {
      showToast(`❌ ${error?.message || 'Không thể trang bị vật phẩm. Vui lòng thử lại.'}`)
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleUseItem = async (item) => {
    if (!user) {
      showToast('❌ Bạn cần đăng nhập để dùng vật phẩm.')
      return
    }

    try {
      setIsLoadingAction(true)
      const result = await useShopItem(item.id)
      await loadShopData()
      if (typeof result?.gems === 'number') {
        setGems(result.gems)
      }
      showToast(result?.message || `✅ Đã dùng: ${item.name}`)
    } catch (error) {
      showToast(`❌ ${error?.message || 'Không thể dùng vật phẩm. Vui lòng thử lại.'}`)
    } finally {
      setIsLoadingAction(false)
    }
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Cửa hàng</h1>
        <p>Mua vật phẩm hữu ích cho hành trình học tập</p>
      </div>

      {/* Currency Balance */}
      <div className="currency-balance">
        <div className="balance-card">
          <span className="currency-icon">💎</span>
          <div className="balance-info">
            <h3>Lingots của bạn</h3>
            <p className="balance-amount">{gems.toLocaleString()}</p>
          </div>
        </div>
        <div className="earn-info">
          <p>💡 Kiếm Lingots bằng cách hoàn thành bài học và thử thách!</p>
        </div>
      </div>

      {/* Shop Categories */}
      <div className="shop-categories">
        <button className="category-btn active">Tất cả</button>
        <button className="category-btn">Tăng cường</button>
        <button className="category-btn">Trang phục</button>
      </div>

      {/* Shop Items */}
      <div className="shop-grid">
        {items.map((item) => (
          <div key={item.id} className="shop-item">
            <div className="item-icon">{item.icon}</div>
            <div className="item-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="item-footer">
                <div className="item-price">
                  <span className="price-icon">💎</span>
                  <span className="price-amount">{item.price}</span>
                </div>
                {item.isPurchased && item.quantity > 0 && (
                  <div className="item-price">
                    <span className="price-icon">🎒</span>
                    <span className="price-amount">x{item.quantity}</span>
                  </div>
                )}
                {!item.isPurchased && (
                  <button
                    className="buy-btn"
                    onClick={() => handlePurchase(item)}
                    disabled={isLoadingAction}
                  >
                    Mua
                  </button>
                )}
                {item.isPurchased && (
                  isCosmeticCategory(item.category)
                    ? (
                      <button
                        className="buy-btn"
                        onClick={() => handleEquip(item)}
                        disabled={isLoadingAction}
                      >
                        {item.isEquipped ? 'Gỡ' : 'Trang bị'}
                      </button>
                    )
                    : (
                      <button
                        className="buy-btn"
                        onClick={() => handleUseItem(item)}
                        disabled={isLoadingAction || item.quantity <= 0}
                      >
                        Dùng
                      </button>
                    )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Special Offers */}
      <div className="special-offers">
        <h2>Ưu đãi đặc biệt</h2>
        <div className="offer-card">
          <div className="offer-badge">🎁 Giảm 50%</div>
          <div className="offer-content">
            <h3>Gói Super Duolingo</h3>
            <p>Truy cập không giới hạn tất cả tính năng cao cấp</p>
            <ul className="offer-features">
              <li>✓ Không quảng cáo</li>
              <li>✓ Trái tim không giới hạn</li>
              <li>✓ Bài tập được cá nhân hóa</li>
              <li>✓ Luyện tập lỗi sai miễn phí</li>
            </ul>
            <button className="offer-btn">Dùng thử 2 tuần miễn phí</button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="shop-tips">
        <h3>💰 Cách kiếm Lingots</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📚</span>
            <h4>Hoàn thành bài học</h4>
            <p>+10 lingots mỗi bài</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🏆</span>
            <h4>Đạt thành tích</h4>
            <p>+50 lingots mỗi thành tích</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Thử thách hàng ngày</h4>
            <p>+20 lingots mỗi ngày</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👥</span>
            <h4>Mời bạn bè</h4>
            <p>+100 lingots mỗi bạn</p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default Shop
