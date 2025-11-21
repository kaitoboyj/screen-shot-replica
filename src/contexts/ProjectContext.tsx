import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  projectName: string;
  setProjectName: (name: string) => void;
  contractAddress: string;
  setContractAddress: (address: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projectName, setProjectName] = useState('BTC Bottom');
  const [contractAddress, setContractAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  return (
    <ProjectContext.Provider value={{ projectName, setProjectName, contractAddress, setContractAddress, logoUrl, setLogoUrl }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
