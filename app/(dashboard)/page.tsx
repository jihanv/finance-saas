// import { UserButton } from "@clerk/nextjs"

import DataCharts from "@/components/data-charts";
import DataGrid from "@/components/data-grid";

// import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export default function DashboardPage() {

  return (
    <>
      <div className="max-w-screen 2xl mx-auto w-full pb-10 -mt-24">
        <DataGrid />
        <DataCharts />
      </div>
    </>

  );
}
