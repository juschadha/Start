
const helper = require('./helper')

const Octokit = require('@octokit/rest')

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`
})

const eventOwnerAndRepo = process.env.GITHUB_REPOSITORY
const eventOwner = helper.getOwner(eventOwnerAndRepo)
const eventRepo = helper.getRepo(eventOwnerAndRepo)



async function issue_check() {
    
  console.log(eventOwnerAndRepo)

  //read contents of action's event.json
    const eventData = await helper.readFilePromise(
      process.env.GITHUB_EVENT_PATH
    )
    
    const eventJSON = JSON.parse(eventData)

    console.log('JASON --> ' + eventJSON)

    //set eventAction and eventIssueNumber
    eventAction = eventJSON.action
    eventIssueNumber = eventJSON.issue.number
    eventIssueBody = eventJSON.issue.body
    //eventissueLabels = eventJSON.issue.

    const getIssueLabels = helper.getLabels(
      octokit,
      eventOwner,
      eventRepo,
      eventIssueNumber
    )

    console.log("Issue Number " + eventIssueNumber)
    console.log('LABELS ' + getIssueLabels)
try {
    //console.log(eventIssueBody)
    const testlabel = octokit.issues.listLabelsOnIssue.endpoint.merge(octokit,eventOwner,eventRepo,eventIssueNumber)
    const mylabels = await octokit.paginate(testlabel)
    
    console.log(mylabels)

    for (const mlabels of mylabels){
      console.log(mlabels.name)

    }  
  }
  catch(err){
    console.log(err)
  }

    //check if there is Aviso request
   const findAviso = helper.findAviso(
    eventIssueBody
    )

    console.log('Aviso '+findAviso)

    if (findAviso === true) 
    {
      
      helper.addComment(octokit,eventOwner,eventRepo,eventIssueNumber)

    }

  }

  //run the function
  issue_check()
  
  module.exports.issue_check = issue_check
