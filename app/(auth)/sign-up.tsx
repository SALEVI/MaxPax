import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, Text, TextInput, View } from 'react-native';

const background = { uri: 'https://w.wallhaven.cc/full/72/wallhaven-72oomo.jpg' };

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateInput = () => {
    setError('');
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const onLogin = () => {
    if (!validateInput()) {
    }
  };

  return (
    <ImageBackground source={background} resizeMode="cover" className="flex-1">
      <View className="flex-1 justify-center dark:bg-black/55">
        <Text className="mb-5 pl-5 text-4xl font-extrabold antialiased dark:text-zinc-200">
          Log in
        </Text>
        <BlurView
          intensity={30}
          tint="dark"
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
              keyboardType="visible-password"
              autoComplete="password"
              placeholder="Enter your password"
              className="mb-5 min-h-16 w-11/12 rounded-lg border border-lime-500 pl-4 text-lg font-semibold dark:bg-zinc-200 dark:text-zinc-900"
            />
            <Text className="text-red-500">{error}</Text>
            <Link href="/home" asChild>
              <Pressable
                onPress={onLogin}
                className="mb-5 min-h-16 w-11/12 items-center justify-center rounded-lg font-bold dark:bg-lime-500">
                <Text className="text-2xl font-extrabold antialiased dark:text-zinc-200">
                  Sign up
                </Text>
              </Pressable>
            </Link>
            <Link
              href="/sign-up"
              className="mt-2 items-center text-lg font-bold dark:text-lime-500">
              Sign in
            </Link>
          </View>
        </BlurView>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
