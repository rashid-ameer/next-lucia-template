type SignupVerificationEmailProps = {
  verificationCode: string;
};

function SignupVerificationEmail({
  verificationCode,
}: SignupVerificationEmailProps) {
  return (
    <div>
      <h2>{verificationCode}</h2>
    </div>
  );
}
export default SignupVerificationEmail;
