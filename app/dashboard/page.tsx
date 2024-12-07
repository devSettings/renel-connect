import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const OverViewPage = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default OverViewPage;
