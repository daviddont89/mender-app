// ContractorDrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ContractorHomeScreen from './ContractorHomeScreen';
import OpenJobsScreen from './OpenJobsScreen';
import ContractorJobScreen from './ContractorJobScreen';
import ContactUsScreen from './ContactUsScreen';
import AccountScreen from './AccountScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

export default function ContractorDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="ContractorHome">
      <Drawer.Screen name="ContractorHome" component={ContractorHomeScreen} options={{ title: 'Home' }} />
      <Drawer.Screen name="OpenJobsScreen" component={OpenJobsScreen} options={{ title: 'Open Jobs' }} />
      <Drawer.Screen name="ContractorJobScreen" component={ContractorJobScreen} options={{ title: 'My Jobs' }} />
      <Drawer.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ title: 'Contact Us' }} />
      <Drawer.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
}
