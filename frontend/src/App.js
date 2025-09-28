import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

import Layout from './components/Layout';
import KuranHatmi from './components/KuranHatmi';
import CevsenHatmi from './components/CevsenHatmi';
import Virdler from './components/Virdler';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const App = () => {
  return (
    <AppContainer>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<KuranHatmi />} />
            <Route path="/cevsen" element={<CevsenHatmi />} />
            <Route path="/virdler" element={<Virdler />} />
          </Routes>
        </Layout>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AppContainer>
  );
};

export default App;
