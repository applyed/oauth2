import { useStyletron } from 'styletron-react';
import { Layout } from './layout';
import { FormEvent, useState } from 'react';
import { ErrorBanner } from '../common/error-banner';
import { Input } from '../common/input';
import { Button } from '../common/button';
import { Select } from '../common/select';
import { MultiSelect, MultiSelectOption } from '../common/multi-select';
import { APIError, useSignup } from '../api/api';

export function Signup({ isSettingUp }: { isSettingUp: Boolean }) {
  const [css] = useStyletron();

  const { refetch: signupAPI, loading: signupLoading, error } = useSignup();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const body = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      roles: formData
        .get('roles')
        ?.toString()
        ?.split(',')
        .map((role) => role.trim()),
      themePreference: formData.get('themePreference'),
    };
    const result = await signupAPI({
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result?.success) {
      form.reset();
    }
  };

  return (
    <Layout>
      <div
        className={css({
          maxWidth: '560px',
          padding: '1rem',
        })}
      >
        {error ? (
          <ErrorBanner>
            {(error instanceof APIError &&
              (error?.details as { [k: string]: string }).error) ||
              error.message}
          </ErrorBanner>
        ) : (
          <div
            className={css({
              width: '100%',
              height: '1.1rem',
              marginBottom: '2.5rem',
            })}
          />
        )}
        <form onSubmit={onSubmit}>
          <Input name="name" placeholder="Full name" />
          <Input name="username" placeholder="Username" />
          <Input name="email" placeholder="Email" />
          <Input type="password" name="password" placeholder="Password" />
          <MultiSelect name="roles">
            <MultiSelectOption value="admin">Admin</MultiSelectOption>
            <MultiSelectOption value="member">Member</MultiSelectOption>
            <MultiSelectOption value="guest">Guest</MultiSelectOption>
            <MultiSelectOption value="house-guest">
              House Guest
            </MultiSelectOption>
          </MultiSelect>
          <Select name="themePreference">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
          <Button type="submit">Signup</Button>
        </form>
      </div>
    </Layout>
  );
}
