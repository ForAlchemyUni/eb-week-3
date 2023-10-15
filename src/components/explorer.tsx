import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import alchemy from '@/lib/alchemy';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatNumber, formatTimestamp } from '@/lib/utils';
import { Button } from './ui/button';
import { TransactionProvider } from './transaction-context';
import Transactions from './transactions';
import { ca } from 'date-fns/locale';

const Explorer: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [blockDetails, setBlockDetails] = useState<any | null>(null);
	const [gasUsedNumber, setGasUsedNumber] = useState<number>(0);
	const [gasDifferencePercentage, setGasDifferencePercentage] = useState<number>(0);
	const [showTransactions, setShowTransactions] = useState(false);
	const handleToggleTransactions = () => {
		setShowTransactions((prev) => !prev);
	};

	useEffect(() => {
		if (blockDetails) {
			const gasUsed = parseInt(blockDetails.gasUsed._hex, 16);
			const gasLimit = parseInt(blockDetails.gasLimit._hex, 16);

			const gasTarget = gasLimit * 0.5; // 50% of gas limit
			const gasDiffPercentage = ((gasUsed - gasTarget) / gasTarget) * 100;

			setGasUsedNumber(gasUsed);
			setGasDifferencePercentage(gasDiffPercentage);
		}
	}, [blockDetails]);

	async function fetchBlockDetails(blockNumber: string) {
		if (blockNumber) {
			const details = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber, 10));
			setBlockDetails(details);
		}
	}

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			fetchBlockDetails(searchTerm);
			setSearchTerm('');
		}
	};

	return (
		<div className="w-full">
			<div className="flex items-center border-b px-3 w-[24em] ml-auto">
				<MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
				<input
					type="text"
					placeholder="Search transactions, addresses, blocks, and more"
					className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyUp={handleKeyUp}
				/>
			</div>
			{blockDetails && (
				<div>
					{!showTransactions && (
						<Table title="Block Details" className="text-left">
							<TableBody>
								<TableRow>
									<TableCell>Block Height</TableCell>
									<TableCell className="flex items-center">
										<span>{blockDetails.number}</span>
										<Button
											variant="ghost"
											size="sm"
											className="mx-2 h-6 px-1.5"
											onClick={() => fetchBlockDetails(`${parseInt(blockDetails.number) - 1}`)}
										>
											<ChevronLeftIcon />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-1.5"
											onClick={() => fetchBlockDetails(`${parseInt(blockDetails.number) + 1}`)}
										>
											<ChevronRightIcon />
										</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Hash</TableCell>
									<TableCell>{blockDetails.hash}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Timestamp</TableCell>
									<TableCell>{formatTimestamp(blockDetails.timestamp)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Transactions</TableCell>
									<TableCell onClick={handleToggleTransactions} className="cursor-pointer">
										{blockDetails.transactions.length} transactions in this block
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Miner</TableCell>
									<TableCell>{blockDetails.miner}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Difficulty</TableCell>
									<TableCell>{blockDetails.difficulty}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Gas Used</TableCell>
									<TableCell>
										{formatNumber(gasUsedNumber)}
										<span
											className={`ml-2 ${
												gasDifferencePercentage < 50 ? 'text-red-500' : 'text-green-500'
											}`}
										>
											({gasDifferencePercentage > 0 ? '+' : ''}
											{gasDifferencePercentage.toFixed(2)}% Gas Target)
										</span>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Gas Limit</TableCell>
									<TableCell>{formatNumber(parseInt(blockDetails.gasLimit._hex, 16))}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Base Fee Per Gas</TableCell>
									<TableCell>{parseInt(blockDetails.baseFeePerGas._hex, 16)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Extra Data</TableCell>
									<TableCell>{blockDetails.extraData}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Parent Hash</TableCell>
									<TableCell>{blockDetails.parentHash}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Nonce</TableCell>
									<TableCell>{blockDetails.nonce}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					)}
					{showTransactions && (
						<div className="text-left mt-4">
							<h3 className="text-xl">Transactions</h3>
							<p className="mb-8">
								For Block{' '}
								<a className="cursor-pointer" onClick={() => setShowTransactions(false)}>
									{blockDetails.number}
								</a>
							</p>
							<TransactionProvider
								displayBlock={false}
								transactions={blockDetails?.transactions.reverse() || []}
							>
								<Transactions />
							</TransactionProvider>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Explorer;
