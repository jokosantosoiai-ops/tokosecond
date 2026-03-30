declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string | undefined;
      clientKey: string | undefined;
    });
    createTransactionToken(parameter: any): Promise<string>;
  }
}