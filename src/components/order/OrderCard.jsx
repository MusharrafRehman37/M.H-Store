import React from 'react';
import formatePrice from '../../utils/formatePrice';

const OrderCard = ({ order }) => {
  const {
    _id,
    id,
    createdAt,
    totalAmount,
    status,
    items = [],
  } = order || {};

  const getStatusBadgeClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 mb-4">
        <div>
          <span className="text-sm text-gray-500">Order ID:</span>
          <span className="font-semibold text-gray-800 ml-1">#{_id || id || 'N/A'}</span>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
            {status || 'Processing'}
          </span>
          {createdAt && (
            <span className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-3">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
              )}
              <div>
                <p className="font-medium text-gray-800">{item.name || item.product?.name}</p>
                <p className="text-gray-500">Qty: {item.quantity || 1}</p>
              </div>
            </div>
            <span className="font-medium text-gray-700">
              {formatePrice ? formatePrice(item.price * (item.quantity || 1)) : `$${item.price * (item.quantity || 1)}`}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="font-semibold text-gray-700">Total Amount:</span>
        <span className="text-lg font-bold text-gray-900">
          {formatePrice ? formatePrice(totalAmount) : `$${totalAmount}`}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;