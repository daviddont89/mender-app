// ClientDrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ClientHomeScreen from './ClientHomeScreen';
import PostJobScreen from './PostJobScreen';
import ClientJobScreen from './ClientJobScreen';
import ContactUsScreen from './ContactUsScreen';
import AccountScreen from './AccountScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

export default function ClientDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="ClientHomeScreen">
      <Drawer.Screen name="ClientHomeScreen" component={ClientHomeScreen} options={{ title: 'Home' }} />
      <Drawer.Screen name="PostJobScreen" component={PostJobScreen} options={{ title: 'Post a Job' }} />
      <Drawer.Screen name="ClientJobScreen" component={ClientJobScreen} options={{ title: 'My Jobs' }} />
      <Drawer.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ title: 'Contact Us' }} />
      <Drawer.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
}
