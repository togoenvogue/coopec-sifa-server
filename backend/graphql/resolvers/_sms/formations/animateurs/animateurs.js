import { aql, db } from "../../../../../db/arangodb.js";
import {
  getOfficeDoc,
  getUserDoc,
  getUserDocs,
} from "../../../../../helpers/joindocs.js";
import { getSMSFormationDoc } from "../../../../../helpers/joindocs_sms.js";

const smsFormationsAnimsResolver = {
  smsFormationsAnimsCreate: async ({
    trainingStamp,
    projectKey,
    companyKey,
    officeKey,
    animCountAttendu,
    animCountPresent,
    trainingKey,
    socialUserKey,
    socialUserRef,
    animateurKeys,
    animateurRefs,
    comment,
    trainingLat,
    trainingLong,
  }) => {
    const obj = {
      timeStamp: Date.now(),
      trainingStamp: trainingStamp,
      projectKey: projectKey,
      companyKey: companyKey,
      officeKey: officeKey,
      animCountAttendu: animCountAttendu,
      animCountPresent: animCountPresent,
      trainingKey: trainingKey,
      socialUserKey: socialUserKey,
      socialUserRef: socialUserRef,
      animateurKeys: animateurKeys,
      animateurRefs: animateurRefs,
      comment: comment,
      trainingLat: trainingLat,
      trainingLong: trainingLong,
      adminKey: null,
      signatureSocialUser: null,
      signaturesAnimateurs: null,
      adminComments: [],
      status: "Pending",
    };

    const doc_cursor = await db.query(aql`INSERT ${obj} 
    INTO sms_formations_anims RETURN NEW`);
    if (doc_cursor.hasNext) {
      return "SUCCESS";
    } else {
      return `Erreur lors de la création de la formation`;
    }
  },

  smsFormationsAnimsUpdate: async ({
    docKey,
    trainingStamp,
    officeKey,
    animCountAttendu,
    animCountPresent,
    trainingKey,
    animateurKeys,
    animateurRefs,
    comment,
  }) => {
    const obj = {
      docKey: docKey,
      trainingStamp: trainingStamp,
      officeKey: officeKey,
      animCountAttendu: animCountAttendu,
      animCountPresent: animCountPresent,
      trainingKey: trainingKey,
      animateurKeys: animateurKeys,
      animateurRefs: animateurRefs,
      comment: comment,
    };
    const doc_cursor = await db.query(aql`UPDATE ${docKey} 
    WITH ${obj} IN sms_formations_anims RETURN NEW`);
    if (doc_cursor.hasNext) {
      return "SUCCESS";
    } else {
      return `Erreur lors de la mise à jour de la formation`;
    }
  },

  getSmsFormationsAnims: async ({
    companyKey,
    projectKey,
    officeKey,
    skip,
    perPage,
    socialUserKey,
    coverage,
    dateFrom,
    dateTo,
  }) => {
    if (coverage == "Utilisateur") {
      const docs_cursor = await db.query(
        aql`FOR p IN sms_formations_anims  
            FILTER p.companyKey == ${companyKey} 
            AND p.projectKey == ${projectKey} 
            AND p.socialUserKey == ${socialUserKey} 
            AND p.trainingStamp >= ${dateFrom} 
            AND p.trainingStamp <= ${dateTo}
            SORT p.trainingStamp DESC LIMIT ${skip}, ${perPage} RETURN p`,
        { fullCount: true },
        { count: true }
      );
      if (docs_cursor.hasNext) {
        const docs = await docs_cursor.all();
        return docs.map(async (doc) => {
          return {
            ...(doc.officeKey = await getOfficeDoc({
              officeKey: doc.officeKey,
            })),

            ...(doc.trainingKey = await getSMSFormationDoc({
              docKey: doc.trainingKey,
            })),
            ...(doc.animateurKeys = await getUserDocs({
              userKeyArr: doc.animateurKeys,
            })),
            ...(doc.socialUserKey = await getUserDoc({
              userKey: doc.socialUserKey,
            })),
            ...(doc.adminKey =
              doc.adminKey != null
                ? await getUserDoc({
                    userKey: doc.adminKey,
                  })
                : null),

            ...(doc.fullCount = await docs_cursor.extra.stats.fullCount),
            ...doc,
          };
        });
      } else {
        return [];
      }
    } else if (coverage == "Antenne") {
      const docs_cursor = await db.query(
        aql`FOR p IN sms_formations_anims  
          FILTER p.companyKey == ${companyKey} 
          AND p.projectKey == ${projectKey} 
          AND p.officeKey == ${officeKey} 
          AND p.trainingStamp >= ${dateFrom} AND p.trainingStamp <= ${dateTo}
          SORT p.trainingStamp DESC LIMIT ${skip}, ${perPage} RETURN p`,
        { fullCount: true },
        { count: true }
      );
      if (docs_cursor.hasNext) {
        const docs = await docs_cursor.all();
        return docs.map(async (doc) => {
          return {
            ...(doc.officeKey = await getOfficeDoc({
              officeKey: doc.officeKey,
            })),

            ...(doc.trainingKey = await getSMSFormationDoc({
              docKey: doc.trainingKey,
            })),
            ...(doc.animateurKeys = await getUserDocs({
              userKeyArr: doc.animateurKeys,
            })),
            ...(doc.socialUserKey = await getUserDoc({
              userKey: doc.socialUserKey,
            })),
            ...(doc.adminKey =
              doc.adminKey != null
                ? await getUserDoc({
                    userKey: doc.adminKey,
                  })
                : null),

            ...(doc.fullCount = await docs_cursor.extra.stats.fullCount),
            ...doc,
          };
        });
      } else {
        return [];
      }
    } else if (coverage == "Globale") {
      const docs_cursor = await db.query(
        aql`FOR p IN sms_formations_anims  
      FILTER p.companyKey == ${companyKey} 
      AND p.projectKey == ${projectKey} 
      AND p.trainingStamp >= ${dateFrom} AND p.trainingStamp <= ${dateTo}
      SORT p.trainingStamp DESC LIMIT ${skip}, ${perPage} RETURN p`,
        { fullCount: true },
        { count: true }
      );
      if (docs_cursor.hasNext) {
        const docs = await docs_cursor.all();
        return docs.map(async (doc) => {
          return {
            ...(doc.officeKey = await getOfficeDoc({
              officeKey: doc.officeKey,
            })),

            ...(doc.trainingKey = await getSMSFormationDoc({
              docKey: doc.trainingKey,
            })),
            ...(doc.animateurKeys = await getUserDocs({
              userKeyArr: doc.animateurKeys,
            })),
            ...(doc.socialUserKey = await getUserDoc({
              userKey: doc.socialUserKey,
            })),
            ...(doc.adminKey =
              doc.adminKey != null
                ? await getUserDoc({
                    userKey: doc.adminKey,
                  })
                : null),

            ...(doc.fullCount = await docs_cursor.extra.stats.fullCount),
            ...doc,
          };
        });
      } else {
        return [];
      }
    } // end Globale
  },

  smsFormationsAnimsDelete: async ({ docKey }) => {
    // can delete
    const doc_cursor = await db.query(aql`REMOVE ${docKey} IN 
    sms_formations_anims RETURN OLD`);
    if (doc_cursor.hasNext) {
      return "SUCCESS";
    } else {
      return `Une erreur s'est produite lors de la suppression de la formation`;
    }
  },

  smsFormationsAnimsApproveOrReject: async ({
    docKey,
    action,
    adminKey,
    comment,
  }) => {
    let obj;
    switch (action) {
      case "Approuver":
        obj = {
          status: "Approved",
          approveStamp: Date.now(),
          adminKey: adminKey,
        };
        break;
      case "Rejeter":
        obj = {
          status: "Rejected",
          rejectStamp: Date.now(),
          adminKey: adminKey,
        };
        break;
      case "Clôturer la session":
        obj = {
          status: "Closed",
          closeStamp: Date.now(),
        };
        break;

      default:
        break;
    }

    if (action != "Rejeter") {
      const doc_cursor = await db.query(aql`UPDATE ${docKey} 
     WITH ${obj} IN sms_formations_anims RETURN NEW`);
      if (doc_cursor.hasNext) {
        return "SUCCESS";
      } else {
        return `Une erreur s'est produite lors de l'approbation de la formation`;
      }
    } else {
      // reject
      const data_cursor = await db.query(aql`FOR d IN sms_formations_anims 
      FILTER d._key == ${docKey} RETURN d`);
      if (data_cursor.hasNext) {
        const data = await data_cursor.next();
        let commentArr = data.adminComments;
        commentArr.push(comment);

        const doc_cursor = await db.query(aql`UPDATE ${docKey} 
        WITH { status: "Rejected", rejectStamp: ${Date.now()},
        adminKey: ${adminKey}, adminComments: ${commentArr} }
        IN sms_formations_anims RETURN NEW`);
        if (doc_cursor.hasNext) {
          return "SUCCESS";
        } else {
          return `Une erreur s'est produite lors de l'approbation`;
        }
      } else {
        return `Désolé, une erreur s'est produite. Essayez de nouveau ou contactez l'administrateur`;
      }
    }
  },
};

export default smsFormationsAnimsResolver;
