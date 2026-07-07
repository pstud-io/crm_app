import { useForm, Controller } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SignInFormSchema, SignInFormType } from "./types/signinTypes";
import { useSignInEndpoints } from "./hooks/useSignInEndpoints";
export const SignIn = () => {
  const { theme } = useTheme();
  const { setRole } = useAuth();
  const { loading, onSubmitSignIn } = useSignInEndpoints();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <>
      <View id="Test">
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="User ID"
              onBlur={onBlur}
              placeholderTextColor={theme.text}
            />
          )}
          name="username"
        />
        {errors.username && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.username.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 8,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              onBlur={onBlur}
              placeholderTextColor={theme.text}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.password.message}
          </Text>
        )}
        <Button
          title={loading ? "Signing In..." : "Login"}
          disabled={loading}
          onPress={handleSubmit(async (data: SignInFormType) => {
            await onSubmitSignIn(data, setRole);
          })}
        />
      </View>
    </>
  );
};
