import {
  Button,
  Flex,
  HStack,
  IconButton,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { type To, useLocation, useNavigate } from "react-router-dom";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import type { ILink } from "../../types/link";
import { useAuth } from "../../hooks/contexts";
import { AcountMenu } from "../AcountMenu";
import { Logo } from "../Logo";

interface HeaderProps {
  links: ILink[];
}

export function DefaultHeader({ links }: HeaderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleNavigate(path: To) {
    onClose();
    navigate(path);
  }

  function displayUserActions() {
    if (user) return <AcountMenu />;

    return (
      <Button
        size={{ base: "sm", md: "md" }}
        colorScheme="teal"
        _hover={{ transform: "scale(1.05)" }}
        onClick={() => handleNavigate("/login")}
      >
        Login
      </Button>
    );
  }

  return (
    <chakra.header
      position={"sticky"}
      inset={0}
      zIndex={1232}
      py="3"
      px="5"
      backgroundColor={"rgba(255, 255, 255, 0.8)"}
      sx={{
        
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      
      }}
    >
      <Flex width={"100%"} justify={"space-between"} align={"center"}>
        <IconButton
          display={{ base: "initial", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          variant={"ghost"}
          _active={{
            outline: "none",
            bg: "transparent",
          }}
          _focus={{
            bg: "transparent",
          }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon boxSize={6} />}
        />
        <Logo onClick={() => handleNavigate("/")} />
        <HStack gap={12} display={{ base: "none", md: "flex" }}>
          {links.map((link) => (
            <Button
              variant="ghost"
              _hover={{ bg: "transparent", transform: "scale(1.1)" }}
              _disabled={{
                fontWeight: "bold",
                bg: "transparent",
                transform: "scale(1.0)",
              }}
              isDisabled={location.pathname === link.href}
              key={link.name}
              onClick={() => handleNavigate(link.href)}
            >
              {link.name}
            </Button>
          ))}
        </HStack>
        {displayUserActions()}
      </Flex>
      <Flex
        direction="column"
        display={{ base: isOpen ? "flex" : "none", md: "none" }}
      >
        {links.map((link) => (
          <Button
            variant="ghost"
            _disabled={{
              fontWeight: "bold",
              bg: "transparent",
              transform: "scale(1.0)",
            }}
            isDisabled={location.pathname === link.href}
            _hover={{ bg: "transparent", transform: "scale(1.1)" }}
            key={link.name}
            onClick={() => handleNavigate(link.href)}
          >
            {link.name}
          </Button>
        ))}
      </Flex>
    </chakra.header>
  );
}
