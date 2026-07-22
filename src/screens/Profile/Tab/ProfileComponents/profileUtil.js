import badgeColors from "../../../../components/UI/Badge/badgeColors";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { ChevronDown, TrashOutline } from "../../../../svg";
import LocationPinIcon from "../../../../svg/LocationPinIcon";
import LockIcon from "../../../../svg/lock-icon";
import LogoutIcon from "../../../../svg/logout-icon";
import MailIcon from "../../../../svg/mail-icon";
import PhoneIcon from "../../../../svg/phone";
import SyncDelete from "../../../../svg/sync-delete";
import { SH, SW } from "../../../../utils";

export const getBasicDetails = (profile) => {
  return [
    {
      leftIcon: () => (
        <PhoneIcon
          width={SH(20)}
          height={SH(20)}
          stroke={badgeColors.outline.text}
          strokeWidth={SW(1)}
        />
      ),
      leftIconTheme: badgeColors.outline,
      hasRightIcon: true,
      rightIcon: undefined,
      label: profile?.phone || "99",
      labelColor: primaryColors.brand[1000],
      onPress: () => null,
      id: "contact_details",
    },
    {
      leftIcon: () => (
        <MailIcon
          width={SH(20)}
          height={SH(20)}
          stroke={badgeColors.outline.text}
          strokeWidth={SW(1)}
        />
      ),
      leftIconTheme: badgeColors.outline,
      hasRightIcon: true,
      rightIcon: undefined,
      label: profile?.email,
      labelColor: primaryColors.brand[1000],
      onPress: () => null,
      id: "email_details",
    },
    {
      leftIcon: () => (
        <LocationPinIcon
          width={SH(20)}
          height={SH(20)}
          stroke={badgeColors.outline.text}
          strokeWidth={SW(1)}
        />
      ),
      leftIconTheme: badgeColors.outline,
      hasRightIcon: true,
      rightIcon: undefined,
      label: profile?.address,
      labelColor: primaryColors.brand[1000],
      onPress: () => null,
      id: "address_details",
    },
  ];
};

export const getAccountSettings = (navigation, handleLogout, cleanSyncData) => {
  return [
    {
      leftIcon: () => (
        <LockIcon
          width={SH(20)}
          height={SH(20)}
          stroke={badgeColors.outline.text}
          strokeWidth={SW(1)}
        />
      ),
      leftIconTheme: badgeColors.outline,
      hasRightIcon: true,
      rightIcon: undefined,
      label: "Reset Password",
      labelColor: primaryColors.brand[1000],
      onPress: () => navigation.push("ResetPassword"),
      id: "reset_password",
    },
    // {
    //   leftIcon: () => <SyncDelete fill={badgeColors.error.text} />,
    //   leftIconTheme: badgeColors.error,
    //   hasRightIcon: true,
    //   rightIcon: undefined,
    //   label: "Clean Sync Data",
    //   labelColor: primaryColors.error[500],
    //   onPress: cleanSyncData,
    //   id: "delete_sync_data",
    // },
    {
      leftIcon: () => (
        <LogoutIcon
          width={SH(20)}
          height={SH(20)}
          stroke={badgeColors.error.text}
          strokeWidth={SW(1)}
        />
      ),
      leftIconTheme: badgeColors.error,
      hasRightIcon: true,
      rightIcon: undefined,
      label: "Logout",
      labelColor: primaryColors.error[500],
      onPress: handleLogout,
      id: "logout",
    },
    {
      leftIcon: () => (
        <TrashOutline
          width={SW(20)}
          height={SH(20)}
          stroke={primaryColors.error[500]}
          strokeWidth={1.5}
        />
      ),
      leftIconTheme: badgeColors.error,
      hasRightIcon: true,
      rightIcon: undefined,
      label: "Delete Account",
      labelColor: primaryColors.error[500],
      onPress: handleLogout,
      id: "delete_logout",
    },
  ];
};
