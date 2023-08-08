import * as Layout from '@app/src/components/Layout.style';
import Box from '@mui/material/Box';
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabNavProps {
  children?: React.ReactNode;
  selectedTab: number;
  // handleChange: React.Dispatch<React.SetStateAction<any>>;
  labels: string[];
}

export default function TabNav(props: TabNavProps) {
  const { children, selectedTab, labels, ...other } = props;

  const handleTabChange = (event: React.SyntheticEvent) => {
    // handleChange(selectedTab);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs">
        {/* <Tab label="Item One" {...a11yProps(0)} />
      <Tab label="Item Two" {...a11yProps(1)} />
      <Tab label="Item Three" {...a11yProps(2)} /> */}
        {labels.map((item, index) => (
          <Tab label={item} {...a11yProps(index)} />
        ))}
      </Tabs>
    </Box>
  );
}