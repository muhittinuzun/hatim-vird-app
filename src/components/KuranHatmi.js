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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  max-width: 900px;
  margin: 0 auto;
`;

const CuzButton = styled.button`
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

const KuranHatmi = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCuz, setSelectedCuz] = useState(null);

  useEffect(() => {
    loadSelections();
  }, []);

  const loadSelections = async () => {
    try {
      const response = await hatimAPI.getKuranSelections();
      setSelections(response.data.data);
    } catch (error) {
      console.error('Seçimler yüklenirken hata:', error);
      toast.error('Seçimler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCuzClick = (cuzNumber) => {
    const isSelected = selections.some(sel => sel.selection_id === cuzNumber);
    
    if (isSelected) {
      toast.info('Bu cüzü zaten seçmişsiniz');
      return;
    }

    setSelectedCuz(cuzNumber);
    setModalOpen(true);
  };

  const handleConfirmSelection = async () => {
    try {
      await hatimAPI.selectKuranCuz(selectedCuz);
      toast.success(`${selectedCuz}. Cüz başarıyla seçildi`);
      loadSelections(); // Seçimleri yeniden yükle
    } catch (error) {
      console.error('Cüz seçimi hatası:', error);
      toast.error('Cüz seçimi yapılamadı');
    }
  };

  const isCuzSelected = (cuzNumber) => {
    return selections.some(sel => sel.selection_id === cuzNumber);
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
      <Title>Kur'an Hatmi</Title>
      <Grid>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((cuzNumber) => (
          <CuzButton
            key={cuzNumber}
            selected={isCuzSelected(cuzNumber)}
            onClick={() => handleCuzClick(cuzNumber)}
            disabled={isCuzSelected(cuzNumber)}
          >
            {cuzNumber}. Cüz
          </CuzButton>
        ))}
      </Grid>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSelection}
        title="Cüz Seçimi"
        message={`${selectedCuz}. Cüzü almak ister misiniz?`}
      />
    </Container>
  );
};

export default KuranHatmi;
