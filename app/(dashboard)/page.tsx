// import { UserButton } from "@clerk/nextjs"
"use client"

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export default function Home() {

  return (
    <>
      <div>
        Home Page
      </div>
    </>

  );
}


// export default function Home() {

//   const accountsQuery = useGetAccounts();

//   if (accountsQuery.isLoading) {
//     return (<div>Loading...</div>)
//   }
//   return (
//     <>
//       <div>
//         {accountsQuery.data?.map((account) => (
//           <div key={account.id}>{account.name}</div>
//         ))}
//       </div>
//     </>

//   );
// }
