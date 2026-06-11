import React from 'react';
import {
    type FieldValues,
    type SubmitHandler,
    type UseFormReturn,
    FormProvider as HookFormProvider
} from "react-hook-form"; 
import {z} from "zod";
import { FormSchemaContext } from './FormContextType';

interface Props<T extends FieldValues, S extends z.ZodTypeAny> {
    children: React.ReactNode;
    methods: UseFormReturn<T>;
    schema: S;
    onSubmit?: SubmitHandler<T>;
}

export default function FormWrapper<T extends FieldValues, S extends z.ZodTypeAny>({
                                                                                       children,
                                                                                       methods,
                                                                                       schema,
                                                                                       onSubmit
                                                                                   }: Props<T, S>) {
    return (
        <FormSchemaContext.Provider value={{schema}}>
            <HookFormProvider {...methods}>
                <form
                    className="w-full"
                    onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}
                >
                    {children}
                </form>
            </HookFormProvider>
        </FormSchemaContext.Provider>
    );
}