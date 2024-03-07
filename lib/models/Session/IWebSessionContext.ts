import { IServiceUser } from ".";

interface ISsrSessionData {
  cookie: string;
}

/**
 * Isomorphic session data.
 */
interface IIsomorphicSessionData {
  serviceUser?: IServiceUser;
}

export interface IWebSessionContext {
  /**
   * Public data which is also used by browser.
   * */
  isomorphic?: IIsomorphicSessionData;
  /**
   * Data for server side rendering.
   * */
  ssr?: ISsrSessionData;
  /**
   * Data for workflow.
   * */
}
