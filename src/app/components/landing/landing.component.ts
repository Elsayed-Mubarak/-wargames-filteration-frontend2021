import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CountdownComponent, CountdownConfig } from "ngx-countdown";
import { TeamProfileInfo } from "src/app/core/interfaces/team/teamProfileInfo";
import { WargamesTime } from "src/app/core/interfaces/time/challengeTime";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  @ViewChild("countdown", { static: false })
  private counter: CountdownComponent;
  moreThan24Hours: CountdownConfig;

  myTeamInfo: TeamProfileInfo;
  competationTime: WargamesTime;
  timeTextImage: string =
    "https://ihawk.s3.us-east-2.amazonaws.com/Coming-Soon-02.png";

  isTeamInfoExists: boolean = false;

  time = 0;

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  async ngOnInit() {
    this.myTeamInfo = this.activeRoute.snapshot.data.teamInfo;
    this.competationTime = this.activeRoute.snapshot.data.competationTime;

    let timeInseconds = 0;
    let competationTimeDate = new Date(this.competationTime.challengeTime);
    let currentTimeDate = new Date(this.competationTime.currentTime);

    timeInseconds =
      competationTimeDate.getTime() / 1000 - currentTimeDate.getTime() / 1000;

    this.time = timeInseconds;

    let days = Math.floor(timeInseconds / 86400);

    if (timeInseconds >= 10 * 86400)
      this.setTime(`${days}:HH:mm:ss`, timeInseconds);
    else if (timeInseconds < 10 * 86400 && timeInseconds > 86400)
      this.setTime(`0${days}:HH:mm:ss`, timeInseconds);
    else if (timeInseconds < 86400 && timeInseconds >= 3600)
      this.setTime(`00:HH:mm:ss`, timeInseconds);
    else if (
      timeInseconds < 86400 &&
      timeInseconds < 3600 &&
      timeInseconds >= 0
    )
      this.setTime(`00:00:mm:ss`, timeInseconds);
    else if (timeInseconds <= 0 && timeInseconds > -86400) {
      this.timeTextImage = "https://ihawk.s3.us-east-2.amazonaws.com/Game+Started.png";

      timeInseconds =
        (competationTimeDate.getTime() + 86400000) / 1000 -
        currentTimeDate.getTime() / 1000;

      let hours = Math.floor(timeInseconds / 3600);
      if (hours > 10) this.setTime(`00:${hours}:mm:ss`, timeInseconds);
      else this.setTime(`00:0${hours}:mm:ss`, timeInseconds);
    } else {
      this.timeTextImage = "https://ihawk.s3.us-east-2.amazonaws.com/Game+Finished.png";
      this.setTime(`00:00:00:00`, 0);
    }

    if (this.myTeamInfo !== null) this.isTeamInfoExists = true;
  }

  goToLogin() {
    this.router.navigate(["/entry/login"], { replaceUrl: false });
  }

  goToSignUp() {
    this.router.navigate(["/entry/signup"], { replaceUrl: false });
  }

  setTime(format, timeInseconds) {
    this.moreThan24Hours = {
      leftTime: timeInseconds,
      format: format,
      timezone: "+0000",
      prettyText: (text) => {
        return text
          .split(":")
          .map((v, index) => `<span class="item${index}">${v}</span>`)
          .join(":");
      },
    };
  }
}
