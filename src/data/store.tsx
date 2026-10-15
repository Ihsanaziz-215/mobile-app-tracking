import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { INITIAL_ORDERS, STAGES } from './mock';
import type { PurchaseOrder } from './types';

interface OrdersContextValue {
  orders: PurchaseOrder[];
  getOrder: (id: string) => PurchaseOrder | undefined;
  updateStage: (id: string, stage: number) => void;
  chooseAction: (id: string, optionId: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const updateStage = useCallback((id: string, stage: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && order.stage !== stage
          ? {
              ...order,
              stage,
              statusLabel: STAGES[stage],
              history: [
                { title: `Status changed to ${STAGES[stage]}`, meta: 'Today · You' },
                ...order.history,
              ],
            }
          : order,
      ),
    );
  }, []);

  const chooseAction = useCallback((id: string, optionId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        const option = order.followUp?.options.find((o) => o.id === optionId);
        if (order.id !== id || !order.followUp || !option) return order;
        return {
          ...order,
          followUp: { ...order.followUp, chosenOptionId: optionId },
          history: [{ title: `Action chosen: ${option.title}`, meta: 'Today · You' }, ...order.history],
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ orders, getOrder, updateStage, chooseAction }),
    [orders, getOrder, updateStage, chooseAction],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}
