
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  amount?: number;
  message?: string;
}

const PaymentStatus = ({ status, transactionId, amount, message }: PaymentStatusProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${getStatusColor()}`}>
          {getStatusTitle()}
        </h2>
        
        {message && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
            {message}
          </p>
        )}
        
        {amount && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Amount: ₦{amount.toLocaleString()}
            </p>
          </div>
        )}
        
        {transactionId && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
              Transaction ID:
            </p>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {transactionId}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
