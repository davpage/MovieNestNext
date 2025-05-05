'use client';
import React from 'react';
import useUserList from '@/app/UserList';
import Header from "@/components/Header";
import {useTranslation} from "react-i18next";
import Link from "next/link";
import {IoOpenOutline} from "react-icons/io5";

const Page = () => {
    const {users, count} = useUserList();
    const classSpan = 'font-bold text-black dark:text-white';
    const {t} = useTranslation();

    return (
        <div className="overflow-x-hidden">
            <Header/>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-indigo-600">{t("online")}: {count}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user, index) => {
                        const now = Date.now();
                        const durationMinutes = ((now - user.connectTime) / 60000).toFixed(1);
                        return (
                            <div
                                key={user.sessionID || index}
                                className="rounded-2xl text-gray-700 dark:text-gray-400 shadow p-4 border border-indigo-600 overflow-auto text-sm"
                            >
                                <div><span className={classSpan}>{t('sessionID')}:</span> {user.sessionID}</div>
                                <div><span className={classSpan}>{t('ip')}:</span> {user.ip || 'Неизвестно'}</div>
                                <div><span className={classSpan}>{t('country')}:</span> {user.country || 'Неизвестно'}</div>
                                <div><span className={classSpan}>{t('city')}:</span> {user.city || 'Неизвестно'}</div>
                                <div><span className={classSpan}>{t('deviceType')}:</span> {user.deviceType}</div>
                                <div><span className={classSpan}>{t('language')}:</span> {user.language}</div>
                                <div><span className={classSpan}>{t('timezone')}:</span> {user.timezone}</div>
                                <div><span className={classSpan}>{t('referrer')}:</span> {user.referrer}</div>
                                <div><span className={classSpan}>{t('userAgent')}:</span> {user.userAgent}</div>
                                <div><span className={classSpan}>{t('isp')}:</span> {user.isp || 'Неизвестно'}</div>
                                <div><span className={classSpan}>{t('proxy')}:</span> {user.proxy ? 'Yes' : 'No'}</div>
                                <div><span className={classSpan}>{t('bot')}:</span> {user.isBot ? 'Yes' : 'No'}</div>
                                <div><span className={classSpan}>{t('tabs')}:</span> {user.tabs}</div>
                                <div><span className={classSpan}>{t('visitDateTime')}:</span> {user.visitDateTime}</div>
                                <div><span className={classSpan}>{t('visitDuration')}:</span> {durationMinutes} min</div>
                                <div><span className={classSpan}>{t('connectTime')}:</span> {new Date(user.connectTime).toLocaleString('ru-RU')}</div>
                                <div className="whitespace-nowrap flex items-center gap-1">
                                    <span className={classSpan}>{t('gpsLocation')}:</span>
                                    {user.gpsLocation && <Link
                                        className="text-blue-700 cursor-pointer flex items-center gap-1"
                                        href={`https://www.openstreetmap.org/?mlat=${user.gpsLocation?.latitude}&mlon=${user.gpsLocation?.longitude}#map=15/${user.gpsLocation?.latitude}/${user.gpsLocation?.longitude}`}
                                        target="_blank"
                                    >
                                        <IoOpenOutline/>
                                        {user.gpsLocation?.latitude}, {user.gpsLocation?.longitude}
                                    </Link>}
                                </div>                                <div><span className={classSpan}>{t('gpsCity')}:</span> {user.gpsCity}, {user.gpsCountry}</div>
                                <div><span className={classSpan}>{t('screenResolution')}:</span> {user.screenResolution}</div>
                                <div><span className={classSpan}>{t('theme')}:</span> {user.theme}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Page;
