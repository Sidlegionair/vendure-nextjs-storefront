import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { Stack } from '@/src/components/atoms/Stack';
import { FormError, FormErrorWrapper, FormRequired, Label } from './shared';

type InputType = InputHTMLAttributes<HTMLInputElement> & {
    label: string | React.ReactNode;
    count: string | React.ReactNode;
    error?: FieldError;
};

export const FacetCheckBox = forwardRef((props: InputType, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { label, count, error, onChange, ...rest } = props;
    const [state, setState] = useState<boolean>(!!props.value);
    return (
        <Wrapper column gap="0.125rem">
            <CheckboxStack itemsCenter gap={10}>
                <CheckboxIconHolder>
                    <AnimatePresence>
                        {(props.checked || state) && (
                            <CheckboxAnimation
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}>
                                <CheckboxIcon size="17px" />
                            </CheckboxAnimation>
                        )}
                    </AnimatePresence>
                </CheckboxIconHolder>
                <Checkbox
                    type="checkbox"
                    {...rest}
                    ref={ref}
                    onChange={e => {
                        setState(e.target.checked);
                        onChange && onChange(e);
                    }}
                />
                <StyledLabel htmlFor={props.name}>
                    <span>
                        {label}
                        {props.required && <FormRequired>&nbsp;*</FormRequired>}
                    </span>
                    <span>{count}</span>
                </StyledLabel>
            </CheckboxStack>
            {props.required && error ? (
                <FormErrorWrapper>
                    <AnimatePresence>
                        {error.message && (
                            <FormError
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}>
                                {error?.message}
                            </FormError>
                        )}
                    </AnimatePresence>
                </FormErrorWrapper>
            ) : null}
        </Wrapper>
    );
});

FacetCheckBox.displayName = 'CheckBox';

const StyledLabel = styled(Label)`
    display: flex;
    align-items: space-between;
    font-size: ${({ theme }) => theme.typography.fontSize.h6};
    justify-content: space-between;
    width: 100%;
    /* identical to box height */
    display: flex;
    align-items: center;

    color: #898989;
`;

const Wrapper = styled(Stack)`
    position: relative;
    width: fit-content;
    width: 100%;
`;

const CheckboxAnimation = styled(motion.div)`
    width: 100%;

    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const CheckboxIcon = styled(Check)`
    background: #000000;
    color: ${p => p.theme.text.white};
    //min-width: 17px;
    //min-height: 17px;
`;

const CheckboxIconHolder = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 17px;
    min-height: 17px;
    border: 1px solid ${p => p.theme.border.main};
    border-radius: 2px;
    //background: #FFFFFF;
    //border-radius: 5px;
`;

const CheckboxStack = styled(Stack)`
    position: relative;
    //width: fit-content;
    width: 100%;
`;

const Checkbox = styled.input`
    appearance: none;
    border: none;
    outline: none;
    background: transparent;

    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    left: 0;
    top: 0;
`;
