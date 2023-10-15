import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Utils } from 'alchemy-sdk';
import { useTransactions } from './transaction-context';
import { noTrailingZeroPrecision, truncateEthAddress, truncateHash } from '@/lib/utils';

const Transactions: React.FC = () => {
	const { displayBlock, transactions } = useTransactions();

	return (
		<div className="w-full">
			<Table title="Block Details" className="text-left">
				<TableHeader>
					<TableRow>
						<TableHead>Txn Hash</TableHead>
						{displayBlock && <TableHead>Block</TableHead>}
						<TableHead>From</TableHead>
						<TableHead>To</TableHead>
						<TableHead>Value</TableHead>
						<TableHead>Txn Fee</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((txn, key) => {
						const baseFee = txn.gasPrice?._hex ? BigInt(txn.gasPrice._hex) : BigInt(0);
						const maxPriorityFee = txn.maxPriorityFeePerGas?._hex
							? BigInt(txn.maxPriorityFeePerGas._hex)
							: BigInt(0);
						const gasLimit = txn.gasLimit?._hex ? BigInt(txn.gasLimit._hex) : BigInt(0);
						const totalFeeWei = gasLimit * (baseFee + maxPriorityFee);
						const totalFee = Utils.formatUnits(totalFeeWei.toString(), 'ether');

						return (
							<TableRow key={key}>
								<TableCell>{truncateHash(txn.hash)}</TableCell>
								{displayBlock && <TableCell>{txn.blockNumber}</TableCell>}
								<TableCell>{truncateEthAddress(txn.from)}</TableCell>
								<TableCell>{truncateEthAddress(txn.to)}</TableCell>
								<TableCell>
									{noTrailingZeroPrecision(Utils.formatEther(txn.value._hex), 9)} ETH
								</TableCell>
								<TableCell>{noTrailingZeroPrecision(totalFee, 8)}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default Transactions;
