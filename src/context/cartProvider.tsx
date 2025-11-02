'use client';
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {WeblinkerCart, WeblinkerCartDeliveryMethod, WeblinkerCartItem} from "@/api/gen/model";
import {useRouter} from "next/navigation";
import {useNotification} from "@/context/notification";

export type ItemOperation = "DEL" | "ADD" | "SUB" | "TOGGLE";

type CartContextType = {
    basket: WeblinkerCart;
    setBasket: Dispatch<SetStateAction<WeblinkerCart>>;
    updateBasetItem: (item: WeblinkerCartItem, op: ItemOperation) => Promise<null | undefined>; // changed — returns a promise
    addPromoCode: (code: string) => Promise<null | undefined>;
    changeDeliveryMetod: (method: WeblinkerCartDeliveryMethod) => Promise<null | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function newQuantity(quantity: number, op: ItemOperation): number {
    switch (op) {
        case "ADD":
            return quantity + 1;
        case "SUB":
            return Math.max(0, quantity - 1);
        case "DEL":
            return 0;
        default:
            return quantity;
    }
}

export function CartProvider({children}: Readonly<{ children: ReactNode }>) {
    const [basket, setBasket] = useState<WeblinkerCart>({} as WeblinkerCart);
    const router = useRouter();
    const notification = useNotification();

    useEffect(() => {
        console.log('basket', basket)
        router.refresh();
    }, [basket, router]);

    const updateBasetItem = useCallback(async (item: WeblinkerCartItem, op: ItemOperation) => {
        try {
            if (!basket) {
                return null
            }

            const prevItems = basket.items ?? [];
            const idx = prevItems.findIndex(i => i.productId === item.productId);
            const newItems = [...prevItems];

            if (idx === -1) {
                newItems.push(item);
            } else {
                if (op === "TOGGLE") {
                    newItems[idx] = {...newItems[idx], checked: !item.checked};
                } else {
                    newItems[idx] = {...newItems[idx], quantity: newQuantity(newItems[idx].quantity ?? 0, op)};
                }
            }
            const res = await fetch(`/api/cart2`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...basket, items: newItems}),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                const message = text || 'Nie udało się zaktualizować koszyka (błąd serwera)';
                notification.showNotification(message, 'error');
                return null;
            }

            const updated = await res.json();
            setBasket(updated);
        } catch (error_) {
            console.error('Failed to update basket item', error_);
            notification.showNotification('Nie udało się zaktualizować koszyka', 'error');
        }
    }, [basket, notification, setBasket]);

    const addPromoCode = useCallback(async (code: string) => {
        try {
            if (!basket) {
                return null
            }

            const res = await fetch(`/api/cart2`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...basket, promoCode: code}),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                const message = text || 'Nie udało się zastosować kodu promocyjnego';
                notification.showNotification(message, 'error');
                return null;
            }

            const updated = await res.json();
            setBasket(updated);
        } catch (error_) {
            console.error('Failed to update basket item', error_);
            notification.showNotification('Nie udało się zastosować kodu promocyjnego', 'error');
        }
    }, [basket, notification, setBasket]);

    const changeDeliveryMetod = useCallback(async (method: WeblinkerCartDeliveryMethod) => {
        try {
            console.log('changeDeliveryMetod called with', method);
            if (!basket) {
                console.log('changeDeliveryMetod: no basket');
                return null;
            }

            const current = basket.deliveryMethod;
            if (current === method) {
                console.log('changeDeliveryMetod: method unchanged, skipping');
                return null;
            }

            const res = await fetch(`/api/cart2`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...basket, deliveryMethod: method}),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                const message = text || 'Nie udało się zmienić metody dostawy';
                notification.showNotification(message, 'error');
                return null;
            }

            const updated = await res.json();
            setBasket(updated);
        } catch (error_) {
            console.error('Failed to change delivery method', error_);
            notification.showNotification('Nie udało się zmienić metody dostawy', 'error');
        }
    }, [basket, notification, setBasket]);

    const value = useMemo(() => ({
        basket,
        setBasket,
        updateBasetItem,
        addPromoCode,
        changeDeliveryMetod
    }), [basket, setBasket, updateBasetItem, addPromoCode, changeDeliveryMetod]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within CartProvider');
    }
    return ctx;
};
