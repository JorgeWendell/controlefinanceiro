import { SummaryCards } from "./components/summary-cards";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <SummaryCards />
    </div>
  );
};

export default Dashboard;
