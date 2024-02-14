/* eslint-disable prettier/prettier */
import { apiProxyAxios } from "../../components/Task/utils"

// export const patchExportWinReview = ({review, token}) => {
//   console.log({review, token})
//   // console.assert(typeof review.agree_with_win === 'boolean', 'agree_with_win must be boolean')
//   // console.assert(typeof review.case_study_willing === 'boolean', 'case_study_willing must be boolean')
//   // console.assert(typeof review.comments === 'string', 'comments must be string')
//   return Promise.resolve()
// }

export const patchExportWinReview = ({review, token}) =>
  apiProxyAxios.patch(
    `/v4/export-win/review/${token}`,
    review,
  )
