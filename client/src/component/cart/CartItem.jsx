import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import formatePrice from '../../utils/formatePrice';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { id, _id, name, image, price, quantity } = item;
  const itemId = id || _id;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-md border border-gray-200"
          />
        )}
        <div>
          <h3 className="font-semibold text-gray-800 text-base">{name}</h3>
          <p className="text-gray-500 text-sm mt-1">{formatePrice ? formatePrice(price) : `$${price}`}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(itemId, quantity - 1)}
            disabled={quantity <= 1}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-1 text-sm font-semibold text-gray-800">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(itemId, quantity + 1)}
            className="p-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>

        <span className="font-bold text-gray-900 text-base min-w-[80px] text-right">
          {formatePrice ? formatePrice(price * quantity) : `$${price * quantity}`}
        </span>

        <button
          onClick={() => onRemove(itemId)}
          className="text-gray-400 hover:text-red-500 p-2 transition cursor-pointer"
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;