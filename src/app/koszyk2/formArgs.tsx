import {zodResolver} from "@hookform/resolvers/zod";
import {CustomerDataZodSchema} from "@/app/koszyk/_schema";
import {ShippingType} from "@/app/koszyk2/KoszykPageDelivery";

export const formArgs = {
    resolver: zodResolver(CustomerDataZodSchema),
    defaultValues: {
        discountCode: '',
        wantInvoice: false,
        acceptedTerms: false,
        deliveryMethod: 'INPOST' as ShippingType,
        deliveryPointId: '',
        person: {
            name: '',
            phone: '',
            email: '',
        },
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            homeNumber: '',
            flatNumber: '',
            info: '',
        },
        invoice: {
            companyName: "",
            nip: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            phone: "",
            email: "",
            homeNumber: "",
            flatNumber: "",
            info: "",
        },
    }
}
