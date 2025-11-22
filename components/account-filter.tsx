"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

import qs from "query-string";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AccountFilter() {
    const router = useRouter()
    const pathname = usePathname()
    const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
    const params = useSearchParams()
    const accountID = params.get("accoundId") || "all"
    const to = params.get("to") || ""
    const from = params.get("from") || ""


    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to
        }

        if (newValue === "all") {
            query.accountId = ""
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }
    return (
        <>
            <Select defaultValue={accountID} onValueChange={onChange} disabled={isLoadingAccounts}>
                <SelectTrigger
                    className="text-black bg-white"
                >
                    <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                            {account.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
