import {
  Html,
  Button,
  Head,
  Container,
  Tailwind,
  Heading,
  Text,
  Font,
} from "@react-email/components";

type ResetPasswordProps = {
  verificationLink: string;
};

function ResetPassword({ verificationLink }: ResetPasswordProps) {
  return (
    <Tailwind>
      <Html
        lang="en"
        dir="ltr">
        <Head>
          <title>Reset your password</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>

        <Container className="text-gray-700">
          <Heading
            as="h1"
            className="text-xl text-gray-800">
            Lucia Auth Testing
          </Heading>
          <Text>Hi,</Text>
          <Text>
            Someone recently requested a password change for your account. If
            this was you, you can set a new password here:
          </Text>
          <Button
            href={verificationLink}
            target="_blank"
            className="bg-black rounded-md px-4 py-2 text-white text-sm font-medium">
            Reset your password
          </Button>
          <Text>
            If you don&apos;t want to change your password or didn&apos;t
            request this, just ignore and delete this message.
          </Text>
          <Text>
            To keep your account secure, please don&apos;t forward this email to
            anyone.
          </Text>
          <Text>Have a nice day!</Text>
        </Container>
      </Html>
    </Tailwind>
  );
}

export default ResetPassword;
