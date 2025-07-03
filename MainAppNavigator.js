import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './AuthProvider';
import HomeScreen from './HomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminScreen from './AdminScreen';
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminUsersScreen from './AdminUsersScreen';
import AdminContractorsScreen from './AdminContractorsScreen';
import AdminJobsScreen from './AdminJobsScreen';
import AdminLogsScreen from './AdminLogsScreen';
import AdminRatingsScreen from './AdminRatingScreen';
import AdminSettingsScreen from './AdminSettingsScreen';
import { fetchUserRole } from './firebase';

const Stack = createNativeStackNavigator();

export default function MainAppNavigator() {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      const role = await fetchUserRole(user.uid);
      setUserRole(role);
    };
    if (user) {
      getRole();
    }
  }, [user]);

  if (!userRole) {
    return null; // Optionally render a loading spinner
  }

  return (
    <Stack.Navigator>
      {userRole === 'contractor' && (
        <>
          <Stack.Screen name="ContractorHome" component={ContractorHomeScreen} />
          <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        </>
      )}
      {userRole === 'client' && (
        <>
          <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        </>
      )}
      {userRole === 'admin' && (
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
          <Stack.Screen name="AdminContractors" component={AdminContractorsScreen} />
          <Stack.Screen name="AdminJobs" component={AdminJobsScreen} />
          <Stack.Screen name="AdminLogs" component={AdminLogsScreen} />
          <Stack.Screen name="AdminRatings" component={AdminRatingsScreen} />
          <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
          <Stack.Screen name="AdminRoleManager" component={AdminScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
