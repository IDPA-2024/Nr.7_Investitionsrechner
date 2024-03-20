import { Button, Heading, VStack, useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useAuth } from "../hooks/contexts";
import { useLocation, useNavigate } from "react-router-dom";

type AuthProcessingStates =
	| null
	| "processing-google-auth"
	| "processing-anonymous-auth";

export function LoginPage() {
	const toast = useToast();
	const navigate = useNavigate();
	const state = useLocation().state as { from?: string };
	const { loginWithGoogle, loginAnnonymously } = useAuth();
	const [processing, setProcessing] = useState<AuthProcessingStates>(null);

	async function handleGoogleLogin() {
		setProcessing("processing-google-auth");
		const loggedIn = await loginWithGoogle();
		setProcessing(null);
		if (loggedIn) handleSuccessfullLogin();
	}

	async function handleAnnonymousLogin() {
		setProcessing("processing-anonymous-auth");
		const loggedIn = await loginAnnonymously();
		handleSuccessfullLogin();
		setProcessing(null);
		if (loggedIn) handleSuccessfullLogin();
	}

	function handleSuccessfullLogin() {
		toast({
			title: "Logged in",
			description: "You have been logged in.",
			status: "success",
		});
		if (state?.from) return navigate(state.from, { replace: true });
		navigate(-1);
	}

	return (
		<VStack>
			<Heading>Login</Heading>
			<VStack width={"100%"} gap={5}>
				<Button
					width={"100%"}
					colorScheme="teal"
					leftIcon={<FcGoogle />}
					isDisabled={!!processing}
					isLoading={processing === "processing-google-auth"}
					onClick={handleGoogleLogin}
				>
					Google
				</Button>
				<Button
					width={"100%"}
					variant="outline"
					colorScheme="teal"
					isDisabled={!!processing}
					isLoading={processing === "processing-anonymous-auth"}
					onClick={handleAnnonymousLogin}
				>
					Annonymus
				</Button>
			</VStack>
		</VStack>
	);
}
