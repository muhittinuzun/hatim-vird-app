import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { virdAPI } from '../services/api';

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

const VirdSection = styled.div`
  margin-bottom: 40px;
  padding: 25px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: #f8f9fa;
`;

const VirdTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.completed ? '#28a745' : '#007bff'};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  font-weight: 500;
  color: #666;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const VirdButton = styled.button`
  padding: 10px 20px;
  border: 2px solid #007bff;
  border-radius: 5px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #007bff;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #6c757d;
    border-color: #6c757d;
    color: white;
  }
`;

const CustomInputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const CustomInput = styled.input`
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 5px;
  width: 120px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CustomButton = styled.button`
  padding: 10px 20px;
  border: 2px solid #28a745;
  border-radius: 5px;
  background: white;
  color: #28a745;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #28a745;
    color: white;
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

const Virdler = () => {
  const [virdStats, setVirdStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customInputs, setCustomInputs] = useState({});

  const virdTypes = [
    { type: 'kelime_tevhid', name: 'Kelime-i Tevhid', target: 70000 },
    { type: 'hasbunallah', name: 'Hasbunallah', target: 19000 },
    { type: 'salaten_nariye', name: 'Salaten Nariye', target: 4444 },
    { type: 'ayetel_kursi', name: 'Ayete\'l Kürsî', target: 313 },
    { type: 'ihlas', name: 'İhlas', target: 1000 }
  ];

  const buttonCounts = [50, 100, 300, 500];

  useEffect(() => {
    loadVirdStats();
  }, []);

  const loadVirdStats = async () => {
    try {
      const response = await virdAPI.getVirdStats();
      setVirdStats(response.data.data);
    } catch (error) {
      console.error('Vird istatistikleri yüklenirken hata:', error);
      toast.error('Vird istatistikleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVirdSelection = async (virdType, virdName, count) => {
    try {
      await virdAPI.selectVird(virdType, virdName, count);
      toast.success(`${virdName} için ${count} adet vird seçildi`);
      loadVirdStats(); // İstatistikleri yeniden yükle
    } catch (error) {
      console.error('Vird seçimi hatası:', error);
      toast.error('Vird seçimi yapılamadı');
    }
  };

  const handleCustomVird = async (virdType, virdName) => {
    const customCount = parseInt(customInputs[virdType] || 0);
    
    if (customCount <= 0) {
      toast.error('Lütfen geçerli bir sayı girin');
      return;
    }

    try {
      await virdAPI.addCustomVird(virdType, virdName, customCount);
      toast.success(`${virdName} için ${customCount} adet vird eklendi`);
      setCustomInputs(prev => ({ ...prev, [virdType]: '' }));
      loadVirdStats(); // İstatistikleri yeniden yükle
    } catch (error) {
      console.error('Serbest vird ekleme hatası:', error);
      toast.error('Serbest vird eklenemedi');
    }
  };

  const getVirdStat = (virdType) => {
    return virdStats.find(stat => stat.vird_type === virdType) || { total_count: 0, is_completed: false };
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Vird istatistikleri yükleniyor...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Virdler</Title>
      
      {virdTypes.map((vird) => {
        const stat = getVirdStat(vird.type);
        const percentage = getProgressPercentage(stat.total_count, vird.target);
        const isCompleted = stat.is_completed;

        return (
          <VirdSection key={vird.type}>
            <VirdTitle>{vird.name}</VirdTitle>
            
            <ProgressBar>
              <ProgressFill 
                percentage={percentage} 
                completed={isCompleted}
              />
            </ProgressBar>
            
            <ProgressText>
              {stat.total_count.toLocaleString()} / {vird.target.toLocaleString()} 
              ({percentage.toFixed(1)}%)
            </ProgressText>

            <ButtonGroup>
              {buttonCounts.map((count) => (
                <VirdButton
                  key={count}
                  onClick={() => handleVirdSelection(vird.type, vird.name, count)}
                  disabled={isCompleted}
                >
                  {count} adet
                </VirdButton>
              ))}
            </ButtonGroup>

            <CustomInputGroup>
              <CustomInput
                type="number"
                placeholder="Serbest giriş"
                value={customInputs[vird.type] || ''}
                onChange={(e) => setCustomInputs(prev => ({
                  ...prev,
                  [vird.type]: e.target.value
                }))}
                disabled={isCompleted}
              />
              <CustomButton
                onClick={() => handleCustomVird(vird.type, vird.name)}
                disabled={isCompleted}
              >
                Ekle
              </CustomButton>
            </CustomInputGroup>
          </VirdSection>
        );
      })}
    </Container>
  );
};

export default Virdler;
