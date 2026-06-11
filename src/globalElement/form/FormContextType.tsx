import {createContext, useContext} from 'react';

interface FormSchemaContextType {
    schema: any;
}

export const FormSchemaContext = createContext<FormSchemaContextType | undefined>(undefined);
export const useFormSchema = () => {
    const context = useContext(FormSchemaContext);
    if (!context) throw new Error("useFormSchema FormProvider daxilində istifadə edilməlidir!");
    return context.schema;
};