import DeansOfficeDashboardLayout from '../components/layout/DeansOfficeDashboard';
import DashboardHome from '../components/dashboard/DashboardHome'; // Assuming a generic DashboardHome might be reused or a specific one created

const DeansOfficeDashboardPage = () => {
  return (
    <DeansOfficeDashboardLayout>
      <DashboardHome /> 
    </DeansOfficeDashboardLayout>
  );
};

export default DeansOfficeDashboardPage;
