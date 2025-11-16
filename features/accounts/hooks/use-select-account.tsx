import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import React, { JSX, useRef, useState } from 'react'
import { useGetAccounts } from '../api/use-get-accounts'
import { useCreateAccount } from '../api/use-create-account';
import { Select } from '@/components/select';



export default function useSelectAccount()
    : [() => JSX.Element, () => Promise<unknown>] {

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))
    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null)

    const selectValue = useRef<string>(undefined)

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })
    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    const AccountDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Account</DialogTitle>
                    <DialogDescription>Please select an account to continue.</DialogDescription>
                </DialogHeader>
                <Select
                    placeholder='Select an account'
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className='pt-2'>
                    <Button
                        onClick={handleCancel}
                        variant="outline">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )


    return [AccountDialog, confirm]
}

// Source: https://medium.com/@kch062522/useconfirm-a-custom-react-hook-to-prompt-confirmation-before-action-f4cb746ebd4e