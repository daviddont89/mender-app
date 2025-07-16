// navigation/HomeDrawer.js

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ClientHomeScreen from '../screens/ClientHomeScreen';
import ContractorHomeScreen from '../screens/ContractorHomeScreen';
import SettingsScreen from '../screens/SettingsScreen'; // placeholder
import ContactUsScreen from '../screens/ContactUsScreen'; // placeholder

const Drawer = createDrawerNavigator();

export default function HomeDrawer({ route }) {
  const { role } = route.params || { role: 'client' }; // fallback to client

  return (
    <Drawer.Navigator initialRouteName={role === 'contractor' ? 'ContractorHome' : 'ClientHome'}>
      {role === 'contractor' ? (
        <Drawer.Screen name="ContractorHome" component={ContractorHomeScreen} options={{ title: 'Home' }} />
      ) : (
        <Drawer.Screen name="ClientHome" component={ClientHomeScreen} options={{ title: 'Home' }} />
      )}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
    </Drawer.Navigator>
  );
}
