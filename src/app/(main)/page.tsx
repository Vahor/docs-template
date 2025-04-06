import * as Button from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <br />
      <div className="flex flex-row gap-4">
        <Button.Root>Button</Button.Root>
        <Button.Root variant="primary" mode="stroke">
          Primary
        </Button.Root>
        <Button.Root variant="error">Tr Again</Button.Root>
        <div className='flex flex-col items-center gap-4'>
          <Button.Root variant='error' mode='lighter'>
            Try Again
          </Button.Root>
        </div>

      </div>
    </div>
  );
}
