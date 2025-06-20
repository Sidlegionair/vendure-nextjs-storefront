import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import styled from '@emotion/styled';
import { Stack } from '@/src/components/atoms/Stack';
import { FormRequired, Label } from './shared';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye } from 'lucide-react';

type InputType = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: FieldError;
};

export const Input = forwardRef((props: InputType, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { label, error, ...rest } = props;
    const [localType, setLocalType] = useState(props.type);
    const isPassword = props.type === 'password';

    return (
        <Stack w100 column gap="0.25rem">
            <InputWrapper w100 column>
                <Label htmlFor={props.name}>
                    {label}
                    {props.required && <FormRequired>&nbsp;*</FormRequired>}
                </Label>
                <StyledInput {...rest} ref={ref} error={!!error?.message} type={localType} />
                {isPassword && (
                    <EyeWrapper
                        justifyCenter
                        itemsCenter
                        active={localType !== 'password'}
                        onClick={() => setLocalType(localType === 'password' ? 'text' : 'password')}>
                        <Eye size={'1.8rem'} />
                    </EyeWrapper>
                )}
                {error?.message && (
                    <AnimatePresence>
                        <Error>
                            <FormError
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}>
                                {error?.message}
                            </FormError>
                        </Error>
                    </AnimatePresence>
                )}
            </InputWrapper>
        </Stack>
    );
});

const Error = styled.div`
    position: absolute;
    right: 1.5rem;
`;

export const FormError = styled(motion.span)`
    color: ${p => p.theme.error};
    font-size: ${p => p.theme.typography.fontSize.h6};
    font-weight: 700;
    margin: 0.4rem 0 0.8rem 0;
`;

const InputWrapper = styled(Stack)`
    position: relative;
    padding: 25px;
    border: 1px solid ${p => p.theme.border.main};
    background: #ffffff;
    border-radius: 8px;
    opacity: 0.8;
`;

const EyeWrapper = styled(Stack)<{ active: boolean }>`
    position: absolute;
    top: 50%;
    right: 1.5rem;

    height: 1.8rem;
    width: 1.8rem;

    cursor: pointer;

    & > svg {
        color: ${p => (p.active ? p.theme.text.accent : p.theme.text.main)};
        transition: color 0.2s ease-in-out;
    }
`;

export const StyledInput = styled.input<{ error?: boolean }>`
    border: 0;
    outline: none;
    margin-top: 0.6rem;
    //padding: 15px 0px;
    color: ${p => p.theme.text.main};
    border-bottom: 1px solid #bbbbbb;
    font-size: ${p => p.theme.typography.fontSize.h6};

    :focus {
        border-bottom: 1px solid #bbbbbb;
    }

    ::placeholder {
        color: ${p => p.theme.placeholder};
    }
    ${p => p.error && `border-color: ${p.theme.error} !important;`}
`;

Input.displayName = 'Input';
