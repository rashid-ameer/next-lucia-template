import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

type SignupVerificationEmailProps = {
  verificationCode: string;
};

function SignupVerificationEmail({
  verificationCode,
}: SignupVerificationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Verify your email address</title>
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
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
        </Head>
        <Preview>
          Verify your email address to complete your Lucia Auth Testing
          registration
        </Preview>

        <Body>
          <Container>
            <Heading
              as="h1"
              className="text-xl">
              Lucia Auth Testing
            </Heading>
            <Text>Hi</Text>
            <Text>
              Thank you for registering for an account on Lucia Auth Testing. To
              complete your registration, please verify your your account by
              using the following code:
            </Text>
            <Text className="text-gray-900 font-bold text-center text-xl">
              {verificationCode}
            </Text>
            <Text>Have a nice day!</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
export default SignupVerificationEmail;
