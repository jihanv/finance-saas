// import { UserButton } from "@clerk/nextjs"
"use client"

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/stores/useNewAccountStore";

// import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export default function Home() {

  const { onOpen } = useNewAccount()

  return (
    <>
      <div>
        <Button onClick={onOpen}>Add an Account</Button>
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
