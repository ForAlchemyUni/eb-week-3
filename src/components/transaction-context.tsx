import { createContext, useContext } from 'react';

interface TransactionContextType {
	displayBlock: boolean;
	transactions: any[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
	const context = useContext(TransactionContext);
	if (!context) {
		throw new Error('useTransactions must be used within a TransactionProvider');
	}
	return context;
};

interface TransactionProviderProps {
	children: React.ReactNode;
	displayBlock: boolean;
	transactions: any[];
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
	children,
	displayBlock,
	transactions,
}) => {
	return (
		<TransactionContext.Provider value={{ displayBlock, transactions }}>
			{children}
		</TransactionContext.Provider>
	);
};

export default TransactionContext;
