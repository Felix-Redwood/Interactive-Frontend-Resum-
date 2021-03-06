function userInformationHTML(user) {
    return `<h2>${user.name}
    <span class="small-name">
    // keeps the user's name small, references the github-styles.css file
    (@<a href="${user.html_url}" target="_blank">${user.login}</a>
    </span>
    </h2>
    <div class="gh-content">
    // displays the github content
    <div class="gh-avatar">
    // displays the github avatar
    <a href="${user.html_url}" target="_blank">
    // sets the href to the user's URL. target = "_blank" means that the link
    // will open in a new window (very important)
    <img src="${user.avatar_url}" width="80px" height="80px" alt="${user.login}" />
    </a>
    </div>
    <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
    </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
        <a href="${repo.html_url}" target="_blank">${repo.name}</a></l1>`;
    });
    
    return `<div class="clearfix repo-list">
    <p>
    <strong>Repo List:</strong>
    // lists the repositories of the user that was searched
    // <strong> sets the font-weight to bold. This is shown in the
    // github-styles.css file
    </p>
    <ul>
    ${listItemsHTML.join("/n")}
    // STILL NEED TO LEARN MORE ABOUT THE /n FUNCTION
    </ul>
    </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");
    // sets the user-data and repo-data html to an empty string, so that every
    // time the text in the box is changed, the repositories are cleared from
    // view
    var username = $("#gh-username").val;
    if (!username) {
        // if there is no username
        $("gh-user-data").html(`<h2>Please Enter a Github Username</h2>`);
        // asks the page user to enter a username
        return;
    }

    $("gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." /></div>`)
            // shows that the function is loading while the function runs

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
        // after the data is gathered...
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("gh-user-data").html(userInformationHTML(userData));
            // sets the html to that generated by the userInformationHTML
            // function
            $("gh-repo-data").html(repoInformationHTML(repoData));
            // sets the html to that generated by the repoInformationHTML
            // function
            
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                // if there is a 404 error
                $("#gh-user-data").html(`<h2>No Info Found for user ${username}`);
                // state that no information is found for the user
            
            } else if(errorResponse.status === 403) {
                // if there is a 403 error, meaning that github has forbidden
                // us from accessing their API due to API throttling
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                // if there is a different kind of error (not 404)
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON}</h2>`);
                    // grab the JSON response and display it
            }
        });
}

$(document).ready(fetchGitHubInformation);
// runs the fetchGitHubInformation function as soon as the document is loaded
// this has the effect of immediately showing us Octocat's information
// Octocat is the official Github account