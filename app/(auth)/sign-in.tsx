import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Pressable, Text, TextInput, View } from 'react-native';

import { useAuth } from '~/providers/AuthProvider';
import { supabase } from '~/utils/supabase';

const background = {
  uri: '*******/storage/v1/object/sign/images/loginBG12.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9naW5CRzEyLnBuZyIsImlhdCI6MTcxNTg1MDg2NiwiZXhwIjoxNzQ3Mzg2ODY2fQ.6Xcr2tsObQCZ0rncdYZ_lnEMZOahh1PApH8raW4c5bs&t=2024-05-16T09%3A14%3A04.777Z',
};

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signInWithEmail() {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    if (!error) {
      router.push('/home');
    }
  }

  return (
    <ImageBackground source={background} resizeMode="cover" className="flex-1">
      <BlurView
        intensity={15}
        className="flex-1"
        experimentalBlurMethod="none"
        tint="systemChromeMaterial">
        <View className="flex-1 justify-center dark:bg-black/60">
          <Text className="mb-5 pl-5 text-4xl font-extrabold antialiased dark:text-zinc-200">
            Log in
          </Text>
          <BlurView
            intensity={30}
            tint="systemThickMaterialDark"
            experimentalBlurMethod="dimezisBlurView"
            className="mx-5 flex h-96 justify-center rounded-2xl"
            style={{ overflow: 'hidden' }}>
            <View className=" w-full items-center justify-center">
              <TextInput
                value={email}
                onChangeText={setEmail}
                numberOfLines={1}
                cursorColor="#84cc16"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="Enter your email address"
                className="my-5 min-h-16 w-11/12 rounded-lg border border-lime-500 pl-4 text-lg font-semibold dark:bg-zinc-200 dark:text-zinc-900"
              />
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                numberOfLines={1}
                cursorColor="#84cc16"
                autoComplete="password"
                placeholder="Enter your password"
                className="min-h-16 w-11/12 rounded-lg border border-lime-500 pl-4 text-lg font-semibold dark:bg-zinc-200 dark:text-zinc-900"
              />
              <Text className="text-red-500" style={{ marginVertical: error !== '' ? 20 : 0 }}>
                {error}
              </Text>

              <Pressable
                disabled={loading}
                onPress={signInWithEmail}
                className="mb-5 min-h-16 w-11/12 items-center justify-center rounded-lg font-bold dark:bg-lime-500">
                {loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-2xl font-extrabold antialiased dark:text-zinc-200">
                    Sign in
                  </Text>
                )}
              </Pressable>

              <Link
                href="/sign-up"
                className="mt-2 items-center text-lg font-bold dark:text-lime-500">
                Create an account
              </Link>
            </View>
          </BlurView>
        </View>
      </BlurView>
    </ImageBackground>
  );
};

export default SignInScreen;
