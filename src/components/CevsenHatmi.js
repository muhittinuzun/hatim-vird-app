import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { hatimAPI } from '../services/api';
import ConfirmationModal from './ConfirmationModal';

const Container = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  max-width: 1000px;
  margin: 0 auto;
`;

const CevsenButton = styled.button`
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: ${props => props.selected ? '#dc3545' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: ${props => props.selected ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &:hover {
    transform: ${props => props.selected ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.selected ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const CevsenHatmi = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Cevşen öğeleri - her biri 3 defa tekrar edecek
  const cevsenItems = [
    'Kur\'an Bölümü',
    'Cevşen',
    'Evradiye',
    'Delailinnur',
    'Sekine vs Evradlar',
    'Münacat\'ül Kur\'an',
    'Tahmidiye',
    'Hülasat\'ül Hülasa',
    'Celcelûtiye',
    'Münacaatlar'
  ];

  // Her öğeyi 3 defa tekrarla
  const allItems = [];
  cevsenItems.forEach((item, index) => {
    for (let i = 0; i < 3; i++) {
      allItems.push({
        id: index * 3 + i + 1,
        name: item
      });
    }
  });

  useEffect(() => {
    loadSelections();
  }, []);

  const loadSelections = async () => {
    try {
      const response = await hatimAPI.getCevsenSelections();
      setSelections(response.data.data);
    } catch (error) {
      console.error('Seçimler yüklenirken hata:', error);
      toast.error('Seçimler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    const isSelected = selections.some(sel => sel.selection_id === item.id);
    
    if (isSelected) {
      toast.info('Bu öğeyi zaten seçmişsiniz');
      return;
    }

    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleConfirmSelection = async () => {
    try {
      await hatimAPI.selectCevsenItem(selectedItem.id, selectedItem.name);
      toast.success(`${selectedItem.name} başarıyla seçildi`);
      loadSelections(); // Seçimleri yeniden yükle
    } catch (error) {
      console.error('Cevşen seçimi hatası:', error);
      toast.error('Cevşen seçimi yapılamadı');
    }
  };

  const isItemSelected = (itemId) => {
    return selections.some(sel => sel.selection_id === itemId);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Seçimler yükleniyor...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Cevşen Hatmi</Title>
      <Grid>
        {allItems.map((item) => (
          <CevsenButton
            key={item.id}
            selected={isItemSelected(item.id)}
            onClick={() => handleItemClick(item)}
            disabled={isItemSelected(item.id)}
          >
            {item.name}
          </CevsenButton>
        ))}
      </Grid>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSelection}
        title="Cevşen Seçimi"
        message={`${selectedItem?.name} almak ister misiniz?`}
      />
    </Container>
  );
};

export default CevsenHatmi;
